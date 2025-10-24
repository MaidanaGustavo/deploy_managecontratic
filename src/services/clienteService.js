// Serviço para gerenciar clientes
// Facilita a migração futura para uma API real

const STORAGE_KEY = 'contractic_clientes'

// Dados mock para testes
const MOCK_CLIENTES = [
  {
    id: 'mock-cliente-1',
    razaoSocial: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@techsolutions.com',
    senha: 'tech123',
    telefone: '(67) 99999-1111',
    endereco: 'Rua das Flores, 123 - Campo Grande/MS',
    dataCadastro: new Date('2024-01-15').toISOString()
  },
  {
    id: 'mock-cliente-2',
    razaoSocial: 'Comercial Silva & Cia',
    cnpj: '98.765.432/0001-10',
    email: 'contato@comercialsilva.com',
    senha: 'silva123',
    telefone: '(67) 98888-2222',
    endereco: 'Av. Principal, 456 - Campo Grande/MS',
    dataCadastro: new Date('2024-02-20').toISOString()
  },
  {
    id: 'mock-cliente-3',
    razaoSocial: 'Empresa Demo Teste',
    cnpj: '11.222.333/0001-44',
    email: 'demo@empresa.com',
    senha: 'demo123',
    telefone: '(67) 97777-3333',
    endereco: 'Rua Teste, 789 - Campo Grande/MS',
    dataCadastro: new Date('2024-03-10').toISOString()
  }
]

// Função auxiliar para obter clientes do localStorage
const getClientesFromStorage = () => {
  try {
    const clientes = localStorage.getItem(STORAGE_KEY)
    if (clientes) {
      return JSON.parse(clientes)
    }

    // Se não houver clientes no storage, retorna os clientes mock
    // e os salva no storage para facilitar o teste
    saveClientesToStorage(MOCK_CLIENTES)
    return MOCK_CLIENTES
  } catch (error) {
    console.error('Erro ao obter clientes:', error)
    return MOCK_CLIENTES // Retorna mock em caso de erro
  }
}

// Função auxiliar para salvar clientes no localStorage
const saveClientesToStorage = (clientes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
    return true
  } catch (error) {
    console.error('Erro ao salvar clientes:', error)
    return false
  }
}

// Serviço de clientes
const clienteService = {
  // Listar todos os clientes
  listar: async () => {
    // Simula uma chamada assíncrona (facilita migração para API)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getClientesFromStorage())
      }, 100)
    })
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clientes = getClientesFromStorage()
        const cliente = clientes.find(c => c.id === id)
        resolve(cliente || null)
      }, 100)
    })
  },

  // Criar novo cliente
  criar: async (clienteData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const clientes = getClientesFromStorage()

          // Verifica se CNPJ já existe
          const cnpjExiste = clientes.some(c => c.cnpj === clienteData.cnpj)
          if (cnpjExiste) {
            reject(new Error('CNPJ já cadastrado'))
            return
          }

          // Cria novo cliente com ID único e timestamp
          const novoCliente = {
            id: Date.now().toString(),
            ...clienteData,
            dataCadastro: new Date().toISOString()
          }

          clientes.push(novoCliente)

          if (saveClientesToStorage(clientes)) {
            resolve(novoCliente)
          } else {
            reject(new Error('Erro ao salvar cliente'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  },

  // Atualizar cliente
  atualizar: async (id, clienteData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const clientes = getClientesFromStorage()
          const index = clientes.findIndex(c => c.id === id)

          if (index === -1) {
            reject(new Error('Cliente não encontrado'))
            return
          }

          clientes[index] = {
            ...clientes[index],
            ...clienteData,
            dataAtualizacao: new Date().toISOString()
          }

          if (saveClientesToStorage(clientes)) {
            resolve(clientes[index])
          } else {
            reject(new Error('Erro ao atualizar cliente'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  },

  // Deletar cliente
  deletar: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const clientes = getClientesFromStorage()
          const clientesFiltrados = clientes.filter(c => c.id !== id)

          if (saveClientesToStorage(clientesFiltrados)) {
            resolve(true)
          } else {
            reject(new Error('Erro ao deletar cliente'))
          }
        } catch (error) {
          reject(error)
        }
      }, 100)
    })
  }
}

export default clienteService

// Para migrar para API no futuro, basta substituir as implementações acima por:
//
// criar: async (clienteData) => {
//   const response = await fetch('/api/clientes', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(clienteData)
//   })
//   return response.json()
// }
//
// E assim por diante para os outros métodos...
