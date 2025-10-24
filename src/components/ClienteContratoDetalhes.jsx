import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import contratoService from '../services/contratoService'
import clienteService from '../services/clienteService'
import { processTemplate } from '../utils/templateProcessor'

export default function ClienteContratoDetalhes() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [contrato, setContrato] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [conteudoProcessado, setConteudoProcessado] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'cliente') {
      navigate('/cliente/login')
      return
    }
    carregarContrato()
  }, [id, user, navigate])

  const carregarContrato = async () => {
    try {
      setLoading(true)
      setError('')

      // Busca o contrato
      const contratoData = await contratoService.buscarPorId(id)

      if (!contratoData) {
        setError('Contrato não encontrado')
        return
      }

      // Verifica se o contrato pertence ao cliente logado
      if (contratoData.clienteId !== user.clienteId) {
        setError('Você não tem permissão para visualizar este contrato')
        return
      }

      setContrato(contratoData)

      // Busca dados do cliente
      const clienteData = await clienteService.buscarPorId(contratoData.clienteId)
      setCliente(clienteData)

      // Processa o template com as variáveis
      if (contratoData.conteudo) {
        const variaveis = {
          cliente: clienteData,
          contrato: contratoData,
          data_atual: new Date().toLocaleDateString('pt-BR'),
          ...contratoData.variaveis
        }
        const conteudo = processTemplate(contratoData.conteudo, variaveis)
        setConteudoProcessado(conteudo)
      }
    } catch (err) {
      console.error('Erro ao carregar contrato:', err)
      setError('Erro ao carregar contrato')
    } finally {
      setLoading(false)
    }
  }

  const handleVoltar = () => {
    navigate('/cliente/dashboard')
  }

  const handleBaixarPDF = () => {
    // Implementar download do PDF no futuro
    alert('Funcionalidade de download em desenvolvimento')
  }

  const handleImprimir = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contrato...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleVoltar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Não imprimir */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={handleVoltar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleImprimir}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
              <button
                onClick={handleBaixarPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0">
        {/* Informações do Contrato - Não imprimir */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:hidden">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {contrato.titulo || 'Contrato sem título'}
              </h1>
              <p className="text-gray-600">{contrato.descricao || 'Sem descrição'}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                contrato.status === 'ativo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {contrato.status || 'Pendente'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Data de Criação</p>
              <p className="font-medium text-gray-800">
                {new Date(contrato.dataCadastro).toLocaleDateString('pt-BR')}
              </p>
            </div>
            {contrato.dataVigencia && (
              <div>
                <p className="text-sm text-gray-600">Data de Vigência</p>
                <p className="font-medium text-gray-800">
                  {new Date(contrato.dataVigencia).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {contrato.valor && (
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-medium text-gray-800">
                  R$ {parseFloat(contrato.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo do Contrato */}
        <div className="bg-white rounded-lg shadow-sm print:shadow-none">
          <div className="p-8 print:p-0">
            {conteudoProcessado ? (
              <div
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: conteudoProcessado }}
              />
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600">Este contrato não possui conteúdo</p>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé - Apenas na impressão */}
        <div className="hidden print:block mt-8 pt-8 border-t border-gray-300">
          <div className="text-center text-sm text-gray-600">
            <p>Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
            <p className="mt-2">{cliente?.razaoSocial} - CNPJ: {cliente?.cnpj}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
