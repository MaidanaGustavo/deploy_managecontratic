// Serviço para gerenciar contratos
// Agora usando API Next.js como backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Serviço de contratos
const contratoService = {
  // Listar todos os contratos
  listar: async () => {
    try {
      const response = await fetch(`${API_URL}/contratos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao listar contratos')
      }

      const data = await response.json()
      // A API retorna { contratos: [...], paginacao: {...} }
      // Retornamos apenas o array de contratos
      return data.contratos || []
    } catch (error) {
      console.error('Erro ao listar contratos:', error)
      throw error
    }
  },

  // Buscar contrato por ID
  buscarPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/contratos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar contrato')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar contrato:', error)
      throw error
    }
  },

  // Buscar contratos por cliente
  buscarPorCliente: async (clienteId) => {
    try {
      const response = await fetch(`${API_URL}/contratos?clienteId=${clienteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar contratos do cliente')
      }

      const data = await response.json()
      // A API retorna { contratos: [...], paginacao: {...} }
      // Retornamos apenas o array de contratos
      return data.contratos || []
    } catch (error) {
      console.error('Erro ao buscar contratos do cliente:', error)
      throw error
    }
  },

  // Criar novo contrato
  criar: async (contratoData) => {
    try {
      const response = await fetch(`${API_URL}/contratos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contratoData)
      })

      if (response.status === 404) {
        throw new Error('Cliente não encontrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao criar contrato')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      throw error
    }
  },

  // Atualizar contrato
  atualizar: async (id, contratoData) => {
    try {
      const response = await fetch(`${API_URL}/contratos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contratoData)
      })

      if (response.status === 404) {
        throw new Error('Contrato não encontrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao atualizar contrato')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error)
      throw error
    }
  },

  // Deletar contrato
  deletar: async (id) => {
    try {
      const response = await fetch(`${API_URL}/contratos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        throw new Error('Contrato não encontrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao deletar contrato')
      }

      return true
    } catch (error) {
      console.error('Erro ao deletar contrato:', error)
      throw error
    }
  }
}

export default contratoService
