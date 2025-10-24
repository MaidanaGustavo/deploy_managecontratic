// Serviço para gerenciar contratos
// Facilita a migração futura para uma API real

const STORAGE_KEY = 'contractic_contratos'

// Dados mock para testes
const MOCK_CONTRATOS = [
  {
    id: 'mock-contrato-1',
    clienteId: 'mock-cliente-1',
    titulo: 'Contrato de Prestação de Serviços - Tech Solutions',
    descricao: 'Contrato mensal de serviços de TI',
    status: 'ativo',
    conteudo: '<h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><p><strong>E-mail:</strong> {{email}}</p><br/><p>Este contrato tem por objeto a prestação de serviços de tecnologia da informação.</p><p><strong>Valor:</strong> R$ 5.000,00 mensais</p><p><strong>Data:</strong> {{data_atual}}</p>',
    dataVigencia: new Date('2025-12-31').toISOString(),
    dataCadastro: new Date('2024-01-15').toISOString(),
    variaveis: {
      razaoSocial: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsolutions.com'
    }
  },
  {
    id: 'mock-contrato-2',
    clienteId: 'mock-cliente-1',
    titulo: 'Contrato de Suporte Técnico',
    descricao: 'Suporte técnico mensal 24/7',
    status: 'ativo',
    conteudo: '<h2>CONTRATO DE SUPORTE TÉCNICO</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><br/><p>Suporte técnico disponível 24 horas por dia, 7 dias por semana.</p><p><strong>Valor:</strong> R$ 2.500,00 mensais</p>',
    dataVigencia: new Date('2025-06-30').toISOString(),
    dataCadastro: new Date('2024-02-01').toISOString(),
    variaveis: {
      razaoSocial: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90'
    }
  },
  {
    id: 'mock-contrato-3',
    clienteId: 'mock-cliente-2',
    titulo: 'Contrato de Fornecimento - Comercial Silva',
    descricao: 'Fornecimento mensal de produtos',
    status: 'ativo',
    conteudo: '<h2>CONTRATO DE FORNECIMENTO</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><p><strong>Endereço:</strong> {{endereco}}</p><br/><p>Este contrato estabelece as condições de fornecimento mensal de produtos.</p><p><strong>Valor:</strong> R$ 15.000,00 mensais</p>',
    dataVigencia: new Date('2025-12-31').toISOString(),
    dataCadastro: new Date('2024-02-20').toISOString(),
    variaveis: {
      razaoSocial: 'Comercial Silva & Cia',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. Principal, 456 - Campo Grande/MS'
    }
  },
  {
    id: 'mock-contrato-4',
    clienteId: 'mock-cliente-3',
    titulo: 'Contrato de Consultoria - Demo',
    descricao: 'Serviços de consultoria empresarial',
    status: 'ativo',
    conteudo: '<h2>CONTRATO DE CONSULTORIA</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><br/><p>Prestação de serviços de consultoria empresarial especializada.</p><p><strong>Valor:</strong> R$ 8.000,00 mensais</p><p><strong>Vigência:</strong> 12 meses</p>',
    dataVigencia: new Date('2025-12-31').toISOString(),
    dataCadastro: new Date('2024-03-10').toISOString(),
    variaveis: {
      razaoSocial: 'Empresa Demo Teste',
      cnpj: '11.222.333/0001-44'
    }
  },
  {
    id: 'mock-contrato-5',
    clienteId: 'mock-cliente-2',
    titulo: 'Contrato de Manutenção - Encerrado',
    descricao: 'Contrato de manutenção preventiva (encerrado)',
    status: 'inativo',
    conteudo: '<h2>CONTRATO DE MANUTENÇÃO PREVENTIVA</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p>Este contrato foi encerrado em 31/12/2023.</p>',
    dataVigencia: new Date('2023-12-31').toISOString(),
    dataCadastro: new Date('2023-01-01').toISOString(),
    variaveis: {
      razaoSocial: 'Comercial Silva & Cia'
    }
  }
]

// Função auxiliar para obter contratos do localStorage
const getContratosFromStorage = () => {
  try {
    const contratos = localStorage.getItem(STORAGE_KEY)
    if (contratos) {
      return JSON.parse(contratos)
    }

    // Se não houver contratos no storage, retorna os contratos mock
    // e os salva no storage para facilitar o teste
    saveContratosToStorage(MOCK_CONTRATOS)
    return MOCK_CONTRATOS
  } catch (error) {
    console.error('Erro ao obter contratos:', error)
    return MOCK_CONTRATOS // Retorna mock em caso de erro
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
