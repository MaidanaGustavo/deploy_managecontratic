// Serviço para gerenciar clientes
// Agora usando API Next.js como backend

// In production (Railway), VITE_API_URL should be /api to use same-origin
// In development, it defaults to http://localhost:3001/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Serviço de clientes
const clienteService = {
  // Listar todos os clientes
  listar: async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao listar clientes')
      }

      const data = await response.json()
      // A API retorna { clientes: [...], paginacao: {...} }
      // Retornamos apenas o array de clientes
      return data.clientes || []
    } catch (error) {
      console.error('Erro ao listar clientes:', error)
      throw error
    }
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar cliente')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
      throw error
    }
  },

  // Criar novo cliente
  criar: async (clienteData) => {
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData)
      })

      if (response.status === 409) {
        const error = await response.json()
        throw new Error(error.error || 'CNPJ ou email já cadastrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao criar cliente')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      throw error
    }
  },

  // Atualizar cliente
  atualizar: async (id, clienteData) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData)
      })

      if (response.status === 404) {
        throw new Error('Cliente não encontrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error
    }
  },

  // Deletar cliente
  deletar: async (id) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        throw new Error('Cliente não encontrado')
      }

      if (!response.ok) {
        throw new Error('Erro ao deletar cliente')
      }

      return true
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      throw error
    }
  },

  // Login de cliente
  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
      })

      if (response.status === 401) {
        throw new Error('Credenciais inválidas')
      }

      if (!response.ok) {
        throw new Error('Erro ao fazer login')
      }

      const data = await response.json()
      return data.cliente
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  }
}

export default clienteService
