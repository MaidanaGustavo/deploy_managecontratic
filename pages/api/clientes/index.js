import connectDB from '../../../lib/mongodb'
import Cliente from '../../../models/Cliente'

export default async function handler(req, res) {
  // Permitir OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // GET - Listar todos os clientes
    if (req.method === 'GET') {
      try {
        const { page = 1, limit = 50, ativo = null } = req.query

        const query = {}
        if (ativo !== null) {
          query.ativo = ativo === 'true'
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [clientes, total] = await Promise.all([
          Cliente.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
          Cliente.countDocuments(query),
        ])

        return res.status(200).json({
          clientes: clientes.map((c) => c.toPublicJSON()),
          paginacao: {
            paginaAtual: parseInt(page),
            totalPaginas: Math.ceil(total / parseInt(limit)),
            totalItens: total,
            itensPorPagina: parseInt(limit),
          },
        })
      } catch (error) {
        console.error('Erro ao listar clientes:', error)
        return res.status(500).json({ error: 'Erro ao listar clientes' })
      }
    }

    // POST - Criar novo cliente
    if (req.method === 'POST') {
      try {
        const { razaoSocial, cnpj, email, telefone, endereco } = req.body

        // Validações
        if (!razaoSocial || !cnpj || !email) {
          return res.status(400).json({
            error: 'Campos obrigatórios: razaoSocial, cnpj, email',
          })
        }

        // Verificar se CNPJ já existe
        const cnpjExiste = await Cliente.findOne({ cnpj })
        if (cnpjExiste) {
          return res.status(409).json({ error: 'CNPJ já cadastrado' })
        }

        // Verificar se email já existe
        const emailExiste = await Cliente.findOne({ email })
        if (emailExiste) {
          return res.status(409).json({ error: 'Email já cadastrado' })
        }

        // Gerar senha padrão baseada nos últimos 6 dígitos do CNPJ
        const cnpjLimpo = cnpj.replace(/\D/g, '')
        const senhaGerada = `cliente${cnpjLimpo.slice(-6)}`

        // Criar cliente
        const novoCliente = new Cliente({
          razaoSocial,
          cnpj,
          email,
          senha: senhaGerada,
          telefone,
          endereco,
        })

        await novoCliente.save()

        // Retorna dados públicos + senha gerada (apenas na criação)
        return res.status(201).json({
          ...novoCliente.toPublicJSON(),
          senhaGerada, // Senha é retornada apenas uma vez na criação
        })
      } catch (error) {
        console.error('Erro ao criar cliente:', error)

        // Tratamento de erros de validação do Mongoose
        if (error.name === 'ValidationError') {
          const erros = Object.values(error.errors).map((e) => e.message)
          return res.status(400).json({ error: erros.join(', ') })
        }

        // Erro de duplicação de chave única
        if (error.code === 11000) {
          const campo = Object.keys(error.keyPattern)[0]
          return res.status(409).json({ error: `${campo} já cadastrado` })
        }

        return res.status(500).json({ error: 'Erro ao criar cliente' })
      }
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error)
    return res.status(500).json({ error: 'Erro ao conectar com banco de dados' })
  }
}
