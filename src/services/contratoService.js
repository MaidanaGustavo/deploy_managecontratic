// Serviço para gerenciar contratos
// Facilita a migração futura para uma API real

const STORAGE_KEY = 'contractic_contratos'

// Função auxiliar para obter contratos do localStorage
const getContratosFromStorage = () => {
  try {
    const contratos = localStorage.getItem(STORAGE_KEY)
    return contratos ? JSON.parse(contratos) : []
  } catch (error) {
    console.error('Erro ao obter contratos:', error)
    return []
  }
}

// Função auxiliar para salvar contratos no localStorage
const saveContratosToStorage = (contratos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos))
    return true
  } catch (error) {
    console.error('Erro ao salvar contratos:', error)
    return false
  }
}

// Serviço de contratos
const contratoService = {
  // Listar todos os contratos
  listar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getContratosFromStorage())
      }, 100)
    })
  },

  // Buscar contrato por ID
  buscarPorId: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contratos = getContratosFromStorage()
        const contrato = contratos.find(c => c.id === id)
        resolve(contrato || null)
      }, 100)
    })
  },

  // Buscar contratos por cliente
  buscarPorCliente: async (clienteId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contratos = getContratosFromStorage()
        const contratosCliente = contratos.filter(c => c.clienteId === clienteId)
        resolve(contratosCliente)
      }, 100)
    })
  },

  // Criar novo contrato
  criar: async (contratoData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const contratos = getContratosFromStorage()

          // Cria novo contrato com ID único e timestamp
          const novoContrato = {
            id: Date.now().toString(),
            ...contratoData,
            dataCadastro: new Date().toISOString()
          }

          contratos.push(novoContrato)

          if (saveContratosToStorage(contratos)) {
            resolve(novoContrato)
          } else {
            reject(new Error('Erro ao salvar contrato'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  },

  // Atualizar contrato
  atualizar: async (id, contratoData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const contratos = getContratosFromStorage()
          const index = contratos.findIndex(c => c.id === id)

          if (index === -1) {
            reject(new Error('Contrato não encontrado'))
            return
          }

          contratos[index] = {
            ...contratos[index],
            ...contratoData,
            dataAtualizacao: new Date().toISOString()
          }

          if (saveContratosToStorage(contratos)) {
            resolve(contratos[index])
          } else {
            reject(new Error('Erro ao atualizar contrato'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  },

  // Deletar contrato
  deletar: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const contratos = getContratosFromStorage()
          const contratosFiltrados = contratos.filter(c => c.id !== id)

          if (saveContratosToStorage(contratosFiltrados)) {
            resolve(true)
          } else {
            reject(new Error('Erro ao deletar contrato'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  }
}

export default contratoService

// Para migrar para API no futuro, basta substituir as implementações acima por:
//
// criar: async (contratoData) => {
//   const response = await fetch('/api/contratos', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(contratoData)
//   })
//   return response.json()
// }
//
// E assim por diante para os outros métodos...
