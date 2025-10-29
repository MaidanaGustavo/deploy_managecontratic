import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const ClienteSchema = new mongoose.Schema(
  {
    razaoSocial: {
      type: String,
      required: [true, 'Razão social é obrigatória'],
      trim: true,
      minlength: [3, 'Razão social deve ter no mínimo 3 caracteres'],
      maxlength: [200, 'Razão social deve ter no máximo 200 caracteres'],
    },
    cnpj: {
      type: String,
      required: [true, 'CNPJ é obrigatório'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Remove caracteres não numéricos
          const cnpjLimpo = v.replace(/[^\d]/g, '')
          return cnpjLimpo.length === 14
        },
        message: 'CNPJ deve ter 14 dígitos',
      },
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        message: 'Email inválido',
      },
    },
    senha: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
      select: false, // Não retorna senha por padrão em queries
    },
    telefone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true // Telefone é opcional
          const telefoneLimpo = v.replace(/[^\d]/g, '')
          return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11
        },
        message: 'Telefone deve ter entre 10 e 11 dígitos',
      },
    },
    endereco: {
      type: String,
      trim: true,
      maxlength: [300, 'Endereço deve ter no máximo 300 caracteres'],
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Cria automaticamente createdAt e updatedAt
    toJSON: {
      virtuals: true, // Garante que campos virtuais sejam incluídos no JSON
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.senha
        return ret
      },
    },
  }
)

// Índices para melhorar performance de busca
ClienteSchema.index({ cnpj: 1 })
ClienteSchema.index({ email: 1 })
ClienteSchema.index({ ativo: 1 })

// Virtual populate para contratos
ClienteSchema.virtual('contratos', {
  ref: 'Contrato', // O modelo a ser usado
  localField: '_id', // O campo no modelo Cliente
  foreignField: 'cliente', // O campo no modelo Contrato
  justOne: false, // Queremos um array de contratos
})


// Hook pre-save para hash de senha
ClienteSchema.pre('save', async function (next) {
  // Só faz hash se a senha foi modificada (ou é nova)
  if (!this.isModified('senha')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.senha = await bcrypt.hash(this.senha, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar senha
ClienteSchema.methods.compararSenha = async function (senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha)
}

// Método para retornar dados públicos do cliente
ClienteSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    razaoSocial: this.razaoSocial,
    cnpj: this.cnpj,
    email: this.email,
    telefone: this.telefone,
    endereco: this.endereco,
    ativo: this.ativo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

// Previne redefinição do modelo em hot reload
export default mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema)
