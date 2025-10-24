import { describe, it, expect } from 'vitest'
import { maskCNPJ, unmaskCNPJ, isValidCNPJ, formatCNPJ } from './maskUtils'

describe('maskUtils', () => {
  describe('maskCNPJ', () => {
    it('deve formatar CNPJ parcial com 2 dígitos', () => {
      expect(maskCNPJ('12')).toBe('12')
    })

    it('deve formatar CNPJ parcial com 5 dígitos', () => {
      expect(maskCNPJ('12345')).toBe('12.345')
    })

    it('deve formatar CNPJ parcial com 8 dígitos', () => {
      expect(maskCNPJ('12345678')).toBe('12.345.678')
    })

    it('deve formatar CNPJ parcial com 12 dígitos', () => {
      expect(maskCNPJ('123456780001')).toBe('12.345.678/0001')
    })

    it('deve formatar CNPJ completo', () => {
      expect(maskCNPJ('12345678000195')).toBe('12.345.678/0001-95')
    })

    it('deve remover caracteres não numéricos antes de formatar', () => {
      expect(maskCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95')
    })

    it('deve lidar com entrada vazia', () => {
      expect(maskCNPJ('')).toBe('')
    })

    it('deve limitar a 14 dígitos', () => {
      expect(maskCNPJ('123456780001959999')).toBe('12.345.678/0001-95')
    })
  })

  describe('unmaskCNPJ', () => {
    it('deve remover máscara do CNPJ formatado', () => {
      expect(unmaskCNPJ('12.345.678/0001-95')).toBe('12345678000195')
    })

    it('deve manter apenas números', () => {
      expect(unmaskCNPJ('12.345.678/0001-95')).toBe('12345678000195')
    })

    it('deve lidar com CNPJ sem máscara', () => {
      expect(unmaskCNPJ('12345678000195')).toBe('12345678000195')
    })

    it('deve lidar com entrada vazia', () => {
      expect(unmaskCNPJ('')).toBe('')
    })
  })

  describe('isValidCNPJ', () => {
    it('deve validar CNPJ válido com máscara', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
    })

    it('deve validar CNPJ válido sem máscara', () => {
      expect(isValidCNPJ('11222333000181')).toBe(true)
    })

    it('deve rejeitar CNPJ com menos de 14 dígitos', () => {
      expect(isValidCNPJ('123456780001')).toBe(false)
    })

    it('deve rejeitar CNPJ com mais de 14 dígitos', () => {
      expect(isValidCNPJ('123456780001959')).toBe(false)
    })

    it('deve rejeitar CNPJ com todos os dígitos iguais', () => {
      expect(isValidCNPJ('11111111111111')).toBe(false)
      expect(isValidCNPJ('00000000000000')).toBe(false)
    })

    it('deve rejeitar CNPJ com dígito verificador inválido', () => {
      expect(isValidCNPJ('11.222.333/0001-00')).toBe(false)
    })

    it('deve rejeitar entrada vazia', () => {
      expect(isValidCNPJ('')).toBe(false)
    })

    it('deve validar múltiplos CNPJs válidos conhecidos', () => {
      // CNPJs válidos de exemplo
      expect(isValidCNPJ('11444777000161')).toBe(true)
      expect(isValidCNPJ('11222333000181')).toBe(true)
    })
  })

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ não formatado', () => {
      expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95')
    })

    it('deve manter CNPJ já formatado', () => {
      expect(formatCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95')
    })

    it('deve retornar string vazia para entrada vazia', () => {
      expect(formatCNPJ('')).toBe('')
    })

    it('deve retornar string vazia para null', () => {
      expect(formatCNPJ(null)).toBe('')
    })

    it('deve retornar string vazia para undefined', () => {
      expect(formatCNPJ(undefined)).toBe('')
    })
  })
})
