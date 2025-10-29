import mongoose from 'mongoose'

// Railway provides DATABASE_URL or MONGO_URL, fallback to MONGODB_URI for local development
const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGO_URL || process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Por favor defina a variável de ambiente MONGODB_URI (local) ou DATABASE_URL/MONGO_URL (Railway) no arquivo .env'
  )
}

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Global é usado aqui para manter uma conexão em cache através de hot reloads
 * em desenvolvimento. Isso previne conexões crescendo exponencialmente
 * durante o desenvolvimento de API routes.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Production optimizations for Railway
      maxPoolSize: isProduction ? 10 : 5,
      minPoolSize: isProduction ? 2 : 1,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      // Retry writes for production reliability
      retryWrites: true,
      w: 'majority',
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      const env = isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'
      console.log(`✅ MongoDB conectado com sucesso [${env}]`)
      if (isProduction) {
        console.log('🚀 Ambiente: Railway/Produção')
      }
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ Erro ao conectar ao MongoDB:', e.message)
    if (isProduction) {
      console.error('🔍 Verifique as variáveis de ambiente no Railway:')
      console.error('   - DATABASE_URL ou MONGO_URL deve estar configurada')
      console.error('   - Certifique-se de que o MongoDB está acessível')
    }
    throw e
  }

  return cached.conn
}

export default connectDB
