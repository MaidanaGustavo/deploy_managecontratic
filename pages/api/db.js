// Banco de dados em memória para desenvolvimento
// Em produção, substituir por banco de dados real (PostgreSQL, MongoDB, etc.)

let clientes = [
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

let contratos = [
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

// Funções auxiliares para manipular dados
export const db = {
  // Clientes
  clientes: {
    getAll: () => clientes,
    getById: (id) => clientes.find(c => c.id === id),
    getByCnpj: (cnpj) => clientes.find(c => c.cnpj === cnpj),
    getByEmail: (email) => clientes.find(c => c.email === email),
    create: (cliente) => {
      const novoCliente = {
        id: Date.now().toString(),
        ...cliente,
        dataCadastro: new Date().toISOString()
      }
      clientes.push(novoCliente)
      return novoCliente
    },
    update: (id, data) => {
      const index = clientes.findIndex(c => c.id === id)
      if (index === -1) return null
      clientes[index] = {
        ...clientes[index],
        ...data,
        dataAtualizacao: new Date().toISOString()
      }
      return clientes[index]
    },
    delete: (id) => {
      const index = clientes.findIndex(c => c.id === id)
      if (index === -1) return false
      clientes.splice(index, 1)
      return true
    }
  },

  // Contratos
  contratos: {
    getAll: () => contratos,
    getById: (id) => contratos.find(c => c.id === id),
    getByClienteId: (clienteId) => contratos.filter(c => c.clienteId === clienteId),
    create: (contrato) => {
      const novoContrato = {
        id: Date.now().toString(),
        ...contrato,
        dataCadastro: new Date().toISOString()
      }
      contratos.push(novoContrato)
      return novoContrato
    },
    update: (id, data) => {
      const index = contratos.findIndex(c => c.id === id)
      if (index === -1) return null
      contratos[index] = {
        ...contratos[index],
        ...data,
        dataAtualizacao: new Date().toISOString()
      }
      return contratos[index]
    },
    delete: (id) => {
      const index = contratos.findIndex(c => c.id === id)
      if (index === -1) return false
      contratos.splice(index, 1)
      return true
    }
  }
}
