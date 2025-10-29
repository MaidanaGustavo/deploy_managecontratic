import mongoose from 'mongoose'
import Cliente from '../models/Cliente.js'
import Contrato from '../models/Contrato.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contractic'

const clientesIniciais = [
  {
    razaoSocial: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@techsolutions.com',
    senha: 'tech123',
    telefone: '(67) 99999-1111',
    endereco: 'Rua das Flores, 123 - Campo Grande/MS',
  },
  {
    razaoSocial: 'Comercial Silva & Cia',
    cnpj: '98.765.432/0001-10',
    email: 'contato@comercialsilva.com',
    senha: 'silva123',
    telefone: '(67) 98888-2222',
    endereco: 'Av. Principal, 456 - Campo Grande/MS',
  },
  {
    razaoSocial: 'Empresa Demo Teste',
    cnpj: '11.222.333/0001-44',
    email: 'demo@empresa.com',
    senha: 'demo123',
    telefone: '(67) 97777-3333',
    endereco: 'Rua Teste, 789 - Campo Grande/MS',
  },
]

async function seed() {
  try {
    console.log('🌱 Conectando ao MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Conectado ao MongoDB')

    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...')
    await Cliente.deleteMany({})
    await Contrato.deleteMany({})
    console.log('✅ Dados limpos')

    // Criar clientes
    console.log('👥 Criando clientes...')
    const clientes = await Cliente.insertMany(clientesIniciais)
    console.log(`✅ ${clientes.length} clientes criados`)

    // Criar contratos
    console.log('📄 Criando contratos...')
    const contratos = [
      {
        cliente: clientes[0]._id,
        titulo: 'Contrato de Prestação de Serviços - Tech Solutions',
        descricao: 'Contrato mensal de serviços de TI',
        status: 'ativo',
        conteudo:
          '<h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><p><strong>E-mail:</strong> {{email}}</p><br/><p>Este contrato tem por objeto a prestação de serviços de tecnologia da informação.</p><p><strong>Valor:</strong> R$ 5.000,00 mensais</p><p><strong>Data:</strong> {{data_atual}}</p>',
        dataVigencia: new Date('2025-12-31'),
        variaveis: {
          razaoSocial: 'Tech Solutions Ltda',
          cnpj: '12.345.678/0001-90',
          email: 'contato@techsolutions.com',
        },
      },
      {
        cliente: clientes[0]._id,
        titulo: 'Contrato de Suporte Técnico',
        descricao: 'Suporte técnico mensal 24/7',
        status: 'ativo',
        conteudo:
          '<h2>CONTRATO DE SUPORTE TÉCNICO</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><br/><p>Suporte técnico disponível 24 horas por dia, 7 dias por semana.</p><p><strong>Valor:</strong> R$ 2.500,00 mensais</p>',
        dataVigencia: new Date('2025-06-30'),
        variaveis: {
          razaoSocial: 'Tech Solutions Ltda',
          cnpj: '12.345.678/0001-90',
        },
      },
      {
        cliente: clientes[1]._id,
        titulo: 'Contrato de Fornecimento - Comercial Silva',
        descricao: 'Fornecimento mensal de produtos',
        status: 'ativo',
        conteudo:
          '<h2>CONTRATO DE FORNECIMENTO</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><p><strong>Endereço:</strong> {{endereco}}</p><br/><p>Este contrato estabelece as condições de fornecimento mensal de produtos.</p><p><strong>Valor:</strong> R$ 15.000,00 mensais</p>',
        dataVigencia: new Date('2025-12-31'),
        variaveis: {
          razaoSocial: 'Comercial Silva & Cia',
          cnpj: '98.765.432/0001-10',
          endereco: 'Av. Principal, 456 - Campo Grande/MS',
        },
      },
      {
        cliente: clientes[2]._id,
        titulo: 'Contrato de Consultoria - Demo',
        descricao: 'Serviços de consultoria empresarial',
        status: 'ativo',
        conteudo:
          '<h2>CONTRATO DE CONSULTORIA</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p><strong>CNPJ:</strong> {{cnpj}}</p><br/><p>Prestação de serviços de consultoria empresarial especializada.</p><p><strong>Valor:</strong> R$ 8.000,00 mensais</p><p><strong>Vigência:</strong> 12 meses</p>',
        dataVigencia: new Date('2025-12-31'),
        variaveis: {
          razaoSocial: 'Empresa Demo Teste',
          cnpj: '11.222.333/0001-44',
        },
      },
      {
        cliente: clientes[1]._id,
        titulo: 'Contrato de Manutenção - Encerrado',
        descricao: 'Contrato de manutenção preventiva (encerrado)',
        status: 'inativo',
        conteudo:
          '<h2>CONTRATO DE MANUTENÇÃO PREVENTIVA</h2><p><strong>CONTRATANTE:</strong> {{razaoSocial}}</p><p>Este contrato foi encerrado em 31/12/2023.</p>',
        dataVigencia: new Date('2023-12-31'),
        variaveis: {
          razaoSocial: 'Comercial Silva & Cia',
        },
      },
    ]

    const contratosInseridos = await Contrato.insertMany(contratos)
    console.log(`✅ ${contratosInseridos.length} contratos criados`)

    console.log('\n🎉 Seed concluído com sucesso!\n')
    console.log('📊 Resumo:')
    console.log(`  - Clientes: ${clientes.length}`)
    console.log(`  - Contratos: ${contratosInseridos.length}`)
    console.log('\n📝 Credenciais de teste:')
    clientesIniciais.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.email} / ${cliente.senha}`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Conexão fechada')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

seed()
