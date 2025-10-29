import connectDB from '../../../lib/mongodb'
import Cliente from '../../../models/Cliente'

export default async function handler(req, res) {
  // Permitir OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // POST - Login de cliente
    if (req.method === 'POST') {
      try {
        const { email, senha } = req.body

        // Validações
        if (!email || !senha) {
          return res.status(400).json({ error: 'Email e senha são obrigatórios' })
        }

        // Buscar cliente por email (incluindo senha para comparação)
        const cliente = await Cliente.findOne({ email }).select('+senha')

        if (!cliente) {
          return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        // Verificar se cliente está ativo
        if (!cliente.ativo) {
          return res.status(401).json({ error: 'Conta desativada. Entre em contato com o suporte.' })
        }

        // Verificar senha usando bcrypt
        const senhaValida = await cliente.compararSenha(senha)

        if (!senhaValida) {
          return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        // Retornar dados do cliente (sem a senha)
        return res.status(200).json({
          success: true,
          cliente: cliente.toPublicJSON(),
        })
      } catch (error) {
        console.error('Erro ao fazer login:', error)
        return res.status(500).json({ error: 'Erro ao fazer login' })
      }
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error)
    return res.status(500).json({ error: 'Erro ao conectar com banco de dados' })
  }
}
