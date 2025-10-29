import connectDB from '../../../lib/mongodb'
import Cliente from '../../../models/Cliente'
import Contrato from '../../../models/Contrato'

export default async function handler(req, res) {
  const { id } = req.query

  // Permitir OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // GET - Buscar cliente por ID
    if (req.method === 'GET') {
      try {
        const cliente = await Cliente.findById(id).populate('contratos')

        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }

        return res.status(200).json(cliente.toPublicJSON())
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        return res.status(500).json({ error: 'Erro ao buscar cliente' })
      }
    }

    // PUT - Atualizar cliente
    if (req.method === 'PUT') {
      try {
        const { razaoSocial, cnpj, email, senha, telefone, endereco, ativo } = req.body

        const cliente = await Cliente.findById(id)

        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }

        // Atualizar campos
        if (razaoSocial !== undefined) cliente.razaoSocial = razaoSocial
        if (cnpj !== undefined) cliente.cnpj = cnpj
        if (email !== undefined) cliente.email = email
        if (senha !== undefined) cliente.senha = senha
        if (telefone !== undefined) cliente.telefone = telefone
        if (endereco !== undefined) cliente.endereco = endereco
        if (ativo !== undefined) cliente.ativo = ativo

        await cliente.save()

        return res.status(200).json(cliente.toPublicJSON())
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        if (error.name === 'ValidationError') {
          const erros = Object.values(error.errors).map((e) => e.message)
          return res.status(400).json({ error: erros.join(', ') })
        }

        if (error.code === 11000) {
          const campo = Object.keys(error.keyPattern)[0]
          return res.status(409).json({ error: `${campo} já cadastrado` })
        }

        return res.status(500).json({ error: 'Erro ao atualizar cliente' })
      }
    }

    // DELETE - Deletar cliente
    if (req.method === 'DELETE') {
      try {
        const cliente = await Cliente.findById(id)

        if (!cliente) {
          return res.status(404).json({ error: 'Cliente não encontrado' })
        }

        // Verificar se cliente tem contratos ativos
        const contratosAtivos = await Contrato.countDocuments({
          cliente: id,
          status: 'ativo',
        })

        if (contratosAtivos > 0) {
          return res.status(400).json({
            error: 'Não é possível deletar cliente com contratos ativos',
            contratosAtivos,
          })
        }

        await Cliente.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Cliente deletado com sucesso' })
      } catch (error) {
        console.error('Erro ao deletar cliente:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        return res.status(500).json({ error: 'Erro ao deletar cliente' })
      }
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error)
    return res.status(500).json({ error: 'Erro ao conectar com banco de dados' })
  }
}
