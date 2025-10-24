import { describe, it, expect, beforeEach, vi } from 'vitest'
import clienteService from './clienteService'

describe('clienteService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('criar', () => {
    it('deve criar um novo cliente', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste LTDA',
        cnpj: '11222333000181',
        nichoProduto: 'Tecnologia'
      }

      const resultado = await clienteService.criar(clienteData)

      expect(resultado).toHaveProperty('id')
      expect(resultado).toHaveProperty('dataCadastro')
      expect(resultado.razaoSocial).toBe(clienteData.razaoSocial)
      expect(resultado.cnpj).toBe(clienteData.cnpj)
      expect(resultado.nichoProduto).toBe(clienteData.nichoProduto)
    })

    it('deve salvar o cliente no localStorage', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste LTDA',
        cnpj: '11222333000181',
        nichoProduto: 'Tecnologia'
      }

      await clienteService.criar(clienteData)

      const clientes = JSON.parse(localStorage.getItem('contractic_clientes'))
      expect(clientes).toHaveLength(1)
      expect(clientes[0].razaoSocial).toBe(clienteData.razaoSocial)
    })

    it('deve rejeitar CNPJ duplicado', async () => {
      const clienteData = {
        razaoSocial: 'Empresa Teste LTDA',
        cnpj: '11222333000181',
        nichoProduto: 'Tecnologia'
      }

      await clienteService.criar(clienteData)

      // Tentar criar outro cliente com mesmo CNPJ
      await expect(
        clienteService.criar({
          razaoSocial: 'Outra Empresa',
          cnpj: '11222333000181',
          nichoProduto: 'Outro'
        })
      ).rejects.toThrow('CNPJ já cadastrado')
    })

    it('deve gerar ID único para cada cliente', async () => {
      const cliente1 = await clienteService.criar({
        razaoSocial: 'Empresa 1',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      const cliente2 = await clienteService.criar({
        razaoSocial: 'Empresa 2',
        cnpj: '11444777000161',
        nichoProduto: 'Saúde'
      })

      expect(cliente1.id).not.toBe(cliente2.id)
    })
  })

  describe('listar', () => {
    it('deve retornar lista vazia quando não há clientes', async () => {
      const clientes = await clienteService.listar()
      expect(clientes).toEqual([])
    })

    it('deve listar todos os clientes cadastrados', async () => {
      await clienteService.criar({
        razaoSocial: 'Empresa 1',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      await clienteService.criar({
        razaoSocial: 'Empresa 2',
        cnpj: '11444777000161',
        nichoProduto: 'Saúde'
      })

      const clientes = await clienteService.listar()
      expect(clientes).toHaveLength(2)
    })
  })

  describe('buscarPorId', () => {
    it('deve buscar cliente por ID', async () => {
      const clienteCriado = await clienteService.criar({
        razaoSocial: 'Empresa Teste',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      const clienteEncontrado = await clienteService.buscarPorId(clienteCriado.id)

      expect(clienteEncontrado).not.toBeNull()
      expect(clienteEncontrado.id).toBe(clienteCriado.id)
      expect(clienteEncontrado.razaoSocial).toBe('Empresa Teste')
    })

    it('deve retornar null quando cliente não existe', async () => {
      const cliente = await clienteService.buscarPorId('id-inexistente')
      expect(cliente).toBeNull()
    })
  })

  describe('atualizar', () => {
    it('deve atualizar dados do cliente', async () => {
      const clienteCriado = await clienteService.criar({
        razaoSocial: 'Empresa Original',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      const clienteAtualizado = await clienteService.atualizar(clienteCriado.id, {
        razaoSocial: 'Empresa Atualizada',
        nichoProduto: 'Saúde'
      })

      expect(clienteAtualizado.razaoSocial).toBe('Empresa Atualizada')
      expect(clienteAtualizado.nichoProduto).toBe('Saúde')
      expect(clienteAtualizado).toHaveProperty('dataAtualizacao')
    })

    it('deve rejeitar atualização de cliente inexistente', async () => {
      await expect(
        clienteService.atualizar('id-inexistente', {
          razaoSocial: 'Nova Razão'
        })
      ).rejects.toThrow('Cliente não encontrado')
    })
  })

  describe('deletar', () => {
    it('deve deletar cliente existente', async () => {
      const clienteCriado = await clienteService.criar({
        razaoSocial: 'Empresa Teste',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      const resultado = await clienteService.deletar(clienteCriado.id)
      expect(resultado).toBe(true)

      const clientes = await clienteService.listar()
      expect(clientes).toHaveLength(0)
    })

    it('deve remover apenas o cliente especificado', async () => {
      const cliente1 = await clienteService.criar({
        razaoSocial: 'Empresa 1',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      const cliente2 = await clienteService.criar({
        razaoSocial: 'Empresa 2',
        cnpj: '11444777000161',
        nichoProduto: 'Saúde'
      })

      await clienteService.deletar(cliente1.id)

      const clientes = await clienteService.listar()
      expect(clientes).toHaveLength(1)
      expect(clientes[0].id).toBe(cliente2.id)
    })
  })

  describe('Integração com localStorage', () => {
    it('deve lidar com erro ao ler localStorage corrompido', async () => {
      localStorage.setItem('contractic_clientes', 'json-invalido')

      const clientes = await clienteService.listar()
      expect(clientes).toEqual([])
    })

    it('deve persistir dados após múltiplas operações', async () => {
      // Criar
      const cliente = await clienteService.criar({
        razaoSocial: 'Empresa Teste',
        cnpj: '11222333000181',
        nichoProduto: 'Tech'
      })

      // Atualizar
      await clienteService.atualizar(cliente.id, {
        razaoSocial: 'Empresa Atualizada'
      })

      // Verificar persistência
      const clientes = await clienteService.listar()
      expect(clientes[0].razaoSocial).toBe('Empresa Atualizada')
    })
  })
})
