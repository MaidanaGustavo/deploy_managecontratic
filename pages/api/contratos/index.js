import connectDB from '../../../lib/mongodb'
import Contrato from '../../../models/Contrato'
import Cliente from '../../../models/Cliente'

export default async function handler(req, res) {
  // Permitir OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // GET - Listar contratos (todos ou por cliente)
    if (req.method === 'GET') {
      try {
        const { clienteId, page = 1, limit = 50, status = null } = req.query

        const query = {}
        if (clienteId) {
          query.cliente = clienteId
        }
        if (status) {
          query.status = status
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [contratos, total] = await Promise.all([
          Contrato.find(query)
            .populate('cliente', 'razaoSocial cnpj email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }),
          Contrato.countDocuments(query),
        ])

        return res.status(200).json({
          contratos,
          paginacao: {
            paginaAtual: parseInt(page),
            totalPaginas: Math.ceil(total / parseInt(limit)),
            totalItens: total,
            itensPorPagina: parseInt(limit),
          },
        })
      } catch (error) {
        console.error('Erro ao listar contratos:', error)
        return res.status(500).json({ error: 'Erro ao listar contratos' })
      }
    }

    // POST - Criar novo contrato
    if (req.method === 'POST') {
      try {
        const { clienteId, titulo, descricao, status, conteudo, dataVigencia, variaveis } =
          req.body

        // Validações
        if (!clienteId || !titulo || !conteudo) {
          return res.status(400).json({
            error: 'Campos obrigatórios: clienteId, titulo, conteudo',
          })
        }

        // Verificar se cliente existe
        const cliente = await Cliente.findById(clienteId)
        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }

        // Criar contrato
        const novoContrato = new Contrato({
          cliente: clienteId,
          titulo,
          descricao: descricao || '',
          status: status || 'ativo',
          conteudo,
          dataVigencia,
          variaveis: variaveis || {},
        })

        await novoContrato.save()

        // Popular informações do cliente
        await novoContrato.populate('cliente', 'razaoSocial cnpj email')

        return res.status(201).json(novoContrato)
      } catch (error) {
        console.error('Erro ao criar contrato:', error)

        if (error.name === 'ValidationError') {
          const erros = Object.values(error.errors).map((e) => e.message)
          return res.status(400).json({ error: erros.join(', ') })
        }

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID de cliente inválido' })
        }

        return res.status(500).json({ error: 'Erro ao criar contrato' })
      }
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error)
    return res.status(500).json({ error: 'Erro ao conectar com banco de dados' })
  }
}
