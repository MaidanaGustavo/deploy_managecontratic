import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import mongoose from 'mongoose'
import Cliente from '../Cliente.js'

// Configurar conexão de teste
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/contractic-test'
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.connection.close()
})

beforeEach(async () => {
  // Limpar collection antes de cada teste
  await Cliente.deleteMany({})
})

describe('Model Cliente', () => {
  describe('Validações', () => {
    it('deve criar um cliente válido', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
        telefone: '(67) 99999-9999',
        endereco: 'Rua Teste, 123',
      }

      const cliente = new Cliente(clienteData)
      const clienteSalvo = await cliente.save()

      expect(clienteSalvo._id).toBeDefined()
      expect(clienteSalvo.razaoSocial).toBe(clienteData.razaoSocial)
      expect(clienteSalvo.cnpj).toBe(clienteData.cnpj)
      expect(clienteSalvo.email).toBe(clienteData.email)
      expect(clienteSalvo.ativo).toBe(true)
      expect(clienteSalvo.createdAt).toBeDefined()
      expect(clienteSalvo.updatedAt).toBeDefined()
    })

    it('deve falhar ao criar cliente sem razão social', async () => {
      const clienteData = {
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar ao criar cliente sem CNPJ', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar ao criar cliente sem email', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar ao criar cliente sem senha', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar com email inválido', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'email-invalido',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar com CNPJ inválido (menos de 14 dígitos)', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-9',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('deve falhar com senha menor que 6 caracteres', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: '12345',
      }

      const cliente = new Cliente(clienteData)

      await expect(cliente.save()).rejects.toThrow()
    })

    it('não deve permitir CNPJ duplicado', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste1@empresa.com',
        senha: 'senha123',
      }

      await Cliente.create(clienteData)

      const clienteDuplicado = new Cliente({
        ...clienteData,
        email: 'teste2@empresa.com',
      })

      await expect(clienteDuplicado.save()).rejects.toThrow()
    })

    it('não deve permitir email duplicado', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      await Cliente.create(clienteData)

      const clienteDuplicado = new Cliente({
        ...clienteData,
        cnpj: '98.765.432/0001-10',
      })

      await expect(clienteDuplicado.save()).rejects.toThrow()
    })
  })

  describe('Hash de Senha', () => {
    it('deve fazer hash da senha antes de salvar', async () => {
      const senhaOriginal = 'senha123'
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: senhaOriginal,
      }

      const cliente = new Cliente(clienteData)
      await cliente.save()

      // Senha deve estar em hash
      const clienteSalvo = await Cliente.findById(cliente._id).select('+senha')
      expect(clienteSalvo.senha).not.toBe(senhaOriginal)
      expect(clienteSalvo.senha).toBeTruthy()
      expect(clienteSalvo.senha.length).toBeGreaterThan(senhaOriginal.length)
    })

    it('deve comparar senha corretamente', async () => {
      const senhaOriginal = 'senha123'
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: senhaOriginal,
      }

      const cliente = new Cliente(clienteData)
      await cliente.save()

      const clienteSalvo = await Cliente.findById(cliente._id).select('+senha')
      const senhaValida = await clienteSalvo.compararSenha(senhaOriginal)
      const senhaInvalida = await clienteSalvo.compararSenha('senhaerrada')

      expect(senhaValida).toBe(true)
      expect(senhaInvalida).toBe(false)
    })
  })

  describe('Métodos', () => {
    it('toPublicJSON deve retornar dados sem senha', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)
      await cliente.save()

      const publicJSON = cliente.toPublicJSON()

      expect(publicJSON.senha).toBeUndefined()
      expect(publicJSON.id).toBeDefined()
      expect(publicJSON.razaoSocial).toBe(clienteData.razaoSocial)
      expect(publicJSON.email).toBe(clienteData.email)
    })
  })

  describe('Campos Opcionais', () => {
    it('deve permitir criar cliente sem telefone', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)
      const clienteSalvo = await cliente.save()

      expect(clienteSalvo._id).toBeDefined()
      expect(clienteSalvo.telefone).toBeUndefined()
    })

    it('deve permitir criar cliente sem endereço', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'teste@empresa.com',
        senha: 'senha123',
      }

      const cliente = new Cliente(clienteData)
      const clienteSalvo = await cliente.save()

      expect(clienteSalvo._id).toBeDefined()
      expect(clienteSalvo.endereco).toBeUndefined()
    })
  })
})
