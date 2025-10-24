import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CadastrarCliente from './CadastrarCliente'
import clienteService from '../services/clienteService'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock do clienteService
vi.mock('../services/clienteService')

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <CadastrarCliente />
    </BrowserRouter>
  )
}

describe('CadastrarCliente', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Renderização', () => {
    it('deve renderizar o formulário com todos os campos', () => {
      renderComponent()

      expect(screen.getByText('Cadastrar Novo Cliente')).toBeInTheDocument()
      expect(screen.getByLabelText(/Razão Social/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Nicho de Produto/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cadastrar Cliente/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
    })

    it('deve exibir placeholders nos campos', () => {
      renderComponent()

      expect(screen.getByPlaceholderText(/Digite a razão social/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/00.000.000\/0000-00/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Ex: Tecnologia/i)).toBeInTheDocument()
    })

    it('deve exibir card informativo', () => {
      renderComponent()

      expect(screen.getByText(/Todos os campos marcados com \* são obrigatórios/i)).toBeInTheDocument()
    })
  })

  describe('Máscara de CNPJ', () => {
    it('deve aplicar máscara ao digitar CNPJ', async () => {
      const user = userEvent.setup()
      renderComponent()

      const cnpjInput = screen.getByLabelText(/CNPJ/i)
      await user.type(cnpjInput, '11222333000181')

      expect(cnpjInput.value).toBe('11.222.333/0001-81')
    })

    it('deve manter apenas 14 dígitos no CNPJ', async () => {
      const user = userEvent.setup()
      renderComponent()

      const cnpjInput = screen.getByLabelText(/CNPJ/i)
      await user.type(cnpjInput, '1122233300018199999')

      expect(cnpjInput.value).toBe('11.222.333/0001-81')
    })

    it('deve remover caracteres não numéricos', async () => {
      const user = userEvent.setup()
      renderComponent()

      const cnpjInput = screen.getByLabelText(/CNPJ/i)
      await user.type(cnpjInput, 'abc11def222ghi333')

      expect(cnpjInput.value).toBe('11.222.333')
    })
  })

  describe('Validação', () => {
    it('deve exibir erro quando CNPJ é inválido', async () => {
      const user = userEvent.setup()
      renderComponent()

      // Preencher campos
      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa Teste')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000100')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tecnologia')

      // Submeter formulário
      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(screen.getByText(/CNPJ inválido/i)).toBeInTheDocument()
      })
    })

    it('deve limpar erro de CNPJ ao digitar novamente', async () => {
      const user = userEvent.setup()
      renderComponent()

      const cnpjInput = screen.getByLabelText(/CNPJ/i)

      // Digitar CNPJ inválido e submeter
      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(cnpjInput, '11222333000100')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')
      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(screen.getByText(/CNPJ inválido/i)).toBeInTheDocument()
      })

      // Digitar novamente
      await user.clear(cnpjInput)
      await user.type(cnpjInput, '1')

      await waitFor(() => {
        expect(screen.queryByText(/CNPJ inválido/i)).not.toBeInTheDocument()
      })
    })

    it('não deve submeter formulário com campos vazios', async () => {
      const user = userEvent.setup()
      renderComponent()

      const submitButton = screen.getByRole('button', { name: /Cadastrar Cliente/i })
      await user.click(submitButton)

      // Verifica que o serviço não foi chamado
      expect(clienteService.criar).not.toHaveBeenCalled()
    })
  })

  describe('Submissão do formulário', () => {
    it('deve cadastrar cliente com dados válidos', async () => {
      const user = userEvent.setup()

      const clienteMock = {
        id: '123',
        razaoSocial: 'Empresa Teste LTDA',
        cnpj: '11222333000181',
        nichoProduto: 'Tecnologia',
        dataCadastro: new Date().toISOString()
      }

      clienteService.criar.mockResolvedValue(clienteMock)

      renderComponent()

      // Preencher formulário
      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa Teste LTDA')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tecnologia')

      // Submeter
      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(clienteService.criar).toHaveBeenCalledWith({
          razaoSocial: 'Empresa Teste LTDA',
          cnpj: '11222333000181',
          nichoProduto: 'Tecnologia'
        })
      })

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        state: {
          message: 'Cliente cadastrado com sucesso!',
          type: 'success'
        }
      })
    })

    it('deve remover máscara do CNPJ antes de salvar', async () => {
      const user = userEvent.setup()
      clienteService.criar.mockResolvedValue({ id: '123' })

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')

      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(clienteService.criar).toHaveBeenCalledWith(
          expect.objectContaining({
            cnpj: '11222333000181' // Sem máscara
          })
        )
      })
    })

    it('deve remover espaços em branco dos campos antes de salvar', async () => {
      const user = userEvent.setup()
      clienteService.criar.mockResolvedValue({ id: '123' })

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), '  Empresa Teste  ')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), '  Tecnologia  ')

      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(clienteService.criar).toHaveBeenCalledWith({
          razaoSocial: 'Empresa Teste',
          cnpj: '11222333000181',
          nichoProduto: 'Tecnologia'
        })
      })
    })

    it('deve exibir erro quando CNPJ já está cadastrado', async () => {
      const user = userEvent.setup()
      clienteService.criar.mockRejectedValue(new Error('CNPJ já cadastrado'))

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')

      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(screen.getByText(/CNPJ já cadastrado/i)).toBeInTheDocument()
      })
    })

    it('deve exibir erro genérico em caso de falha', async () => {
      const user = userEvent.setup()
      clienteService.criar.mockRejectedValue(new Error())

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')

      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Erro ao cadastrar cliente/i })).toBeInTheDocument()
      })
    })
  })

  describe('Estado de loading', () => {
    it('deve exibir estado de loading durante submissão', async () => {
      const user = userEvent.setup()

      // Cria uma promise que não resolve imediatamente
      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      clienteService.criar.mockReturnValue(promise)

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')

      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      // Verifica estado de loading
      await waitFor(() => {
        expect(screen.getByText(/Cadastrando.../i)).toBeInTheDocument()
      })

      // Resolve a promise para limpar o teste
      resolvePromise({ id: '123' })
    })

    it('deve desabilitar botões durante loading', async () => {
      const user = userEvent.setup()

      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      clienteService.criar.mockReturnValue(promise)

      renderComponent()

      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')

      const submitButton = screen.getByRole('button', { name: /Cadastrar Cliente/i })
      const cancelButton = screen.getByRole('button', { name: /Cancelar/i })

      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
        expect(cancelButton).toBeDisabled()
      })

      resolvePromise({ id: '123' })
    })
  })

  describe('Navegação', () => {
    it('deve navegar para dashboard ao clicar em cancelar', async () => {
      const user = userEvent.setup()
      renderComponent()

      await user.click(screen.getByRole('button', { name: /Cancelar/i }))

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    it('deve navegar para dashboard ao clicar no botão voltar', async () => {
      const user = userEvent.setup()
      renderComponent()

      const backButton = screen.getByRole('button', { name: '' }).closest('button')
      await user.click(backButton)

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('Limpeza de erros', () => {
    it('deve limpar erro geral ao digitar em qualquer campo', async () => {
      const user = userEvent.setup()
      clienteService.criar.mockRejectedValue(new Error('Erro de teste'))

      renderComponent()

      // Causar erro
      await user.type(screen.getByLabelText(/Razão Social/i), 'Empresa')
      await user.type(screen.getByLabelText(/CNPJ/i), '11222333000181')
      await user.type(screen.getByLabelText(/Nicho de Produto/i), 'Tech')
      await user.click(screen.getByRole('button', { name: /Cadastrar Cliente/i }))

      await waitFor(() => {
        expect(screen.getByText(/Erro de teste/i)).toBeInTheDocument()
      })

      // Digitar em campo
      await user.type(screen.getByLabelText(/Razão Social/i), 'X')

      await waitFor(() => {
        expect(screen.queryByText(/Erro de teste/i)).not.toBeInTheDocument()
      })
    })
  })
})
