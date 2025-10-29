import connectDB from '../../../lib/mongodb'
import Contrato from '../../../models/Contrato'

export default async function handler(req, res) {
  const { id } = req.query

  // Permitir OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connectDB()

    // GET - Buscar contrato por ID
    if (req.method === 'GET') {
      try {
        const contrato = await Contrato.findById(id).populate(
          'cliente',
          'razaoSocial cnpj email telefone endereco'
        )

        if (!contrato) {
          return res.status(404).json({ error: 'Contrato não encontrado' })
        }

        return res.status(200).json(contrato)
      } catch (error) {
        console.error('Erro ao buscar contrato:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        return res.status(500).json({ error: 'Erro ao buscar contrato' })
      }
    }

    // PUT - Atualizar contrato
    if (req.method === 'PUT') {
      try {
        const { clienteId, titulo, descricao, status, conteudo, dataVigencia, variaveis } =
          req.body

        const contrato = await Contrato.findById(id)

        if (!contrato) {
          return res.status(404).json({ error: 'Contrato não encontrado' })
        }

        // Atualizar campos
        if (clienteId !== undefined) contrato.cliente = clienteId
        if (titulo !== undefined) contrato.titulo = titulo
        if (descricao !== undefined) contrato.descricao = descricao
        if (status !== undefined) contrato.status = status
        if (conteudo !== undefined) contrato.conteudo = conteudo
        if (dataVigencia !== undefined) contrato.dataVigencia = dataVigencia
        if (variaveis !== undefined) contrato.variaveis = variaveis

        await contrato.save()

        // Popular informações do cliente
        await contrato.populate('cliente', 'razaoSocial cnpj email')

        return res.status(200).json(contrato)
      } catch (error) {
        console.error('Erro ao atualizar contrato:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        if (error.name === 'ValidationError') {
          const erros = Object.values(error.errors).map((e) => e.message)
          return res.status(400).json({ error: erros.join(', ') })
        }

        return res.status(500).json({ error: 'Erro ao atualizar contrato' })
      }
    }

    // DELETE - Deletar contrato
    if (req.method === 'DELETE') {
      try {
        const contrato = await Contrato.findById(id)

        if (!contrato) {
          return res.status(404).json({ error: 'Contrato não encontrado' })
        }

        // Soft delete - apenas muda status para cancelado
        if (req.query.soft === 'true') {
          contrato.status = 'cancelado'
          await contrato.save()
          return res.status(200).json({
            message: 'Contrato cancelado com sucesso',
            contrato,
          })
        }

        // Hard delete
        await Contrato.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Contrato deletado com sucesso' })
      } catch (error) {
        console.error('Erro ao deletar contrato:', error)

        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'ID inválido' })
        }

        return res.status(500).json({ error: 'Erro ao deletar contrato' })
      }
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    console.error('Erro de conexão com banco de dados:', error)
    return res.status(500).json({ error: 'Erro ao conectar com banco de dados' })
  }
}
