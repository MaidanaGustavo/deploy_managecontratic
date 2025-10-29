import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import clienteService from '../services/clienteService'
import contratoService from '../services/contratoService'
import { formatCNPJ, formatTelefone, formatCEP } from '../utils/maskUtils'

function ClientesContratos() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedClientId, setExpandedClientId] = useState(null)
  const [error, setError] = useState(null)
  const [contratoParaExcluir, setContratoParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)
      const [clientesData, contratosData] = await Promise.all([
        clienteService.listar(),
        contratoService.listar()
      ])
      setClientes(clientesData)
      setContratos(contratosData)
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.')
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleExpanded = (clientId) => {
    setExpandedClientId(expandedClientId === clientId ? null : clientId)
  }

  const getContratosPorCliente = (clienteId) => {
    if (!contratos || contratos.length === 0) return []
    return contratos.filter(contrato => contrato.cliente?.id === clienteId)
  }

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A'
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  }

  const formatarStatus = (status) => {
    const statusMap = {
      ativo: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
      inativo: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
      pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  const handleEditarContrato = (contrato, cliente) => {
    navigate('/editar-contrato', {
      state: {
        contrato,
        cliente
      }
    })
  }

  const handleExcluirContrato = async () => {
    if (!contratoParaExcluir) return

    setExcluindo(true)
    try {
      await contratoService.deletar(contratoParaExcluir.id)

      // Atualizar a lista de contratos
      setContratos(contratos.filter(c => c.id !== contratoParaExcluir.id))
      setContratoParaExcluir(null)

      // Mostrar mensagem de sucesso
      setError(null)
    } catch (err) {
      setError('Erro ao excluir contrato. Tente novamente.')
      console.error('Erro ao excluir contrato:', err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CM</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800">ContraticManage</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes e Contratos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualize todos os clientes cadastrados e seus respectivos contratos
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : clientes.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum cliente cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece cadastrando um novo cliente no sistema.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/cadastrar-cliente')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Cadastrar Cliente
              </button>
            </div>
          </div>
        ) : (
          /* Clients List */
          <div className="space-y-4">
            {clientes.map((cliente) => {
              const clienteContratos = getContratosPorCliente(cliente.id)
              const isExpanded = expandedClientId === cliente.id

              return (
                <div key={cliente.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Client Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpanded(cliente.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {cliente.razaoSocial?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {cliente.razaoSocial}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {clienteContratos.length} {clienteContratos.length === 1 ? 'contrato' : 'contratos'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              CNPJ: {formatCNPJ(cliente.cnpj)}
                            </span>
                            {cliente.email && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {cliente.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {/* Client Details */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Informações do Cliente</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Nome Fantasia</p>
                            <p className="text-sm font-medium text-gray-900">{cliente.nomeFantasia || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Telefone</p>
                            <p className="text-sm font-medium text-gray-900">{formatTelefone(cliente.telefone) || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Responsável</p>
                            <p className="text-sm font-medium text-gray-900">{cliente.responsavel || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Endereço</p>
                            <p className="text-sm font-medium text-gray-900">
                              {cliente.endereco ? `${cliente.endereco}, ${cliente.numero || 'S/N'}` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">CEP</p>
                            <p className="text-sm font-medium text-gray-900">{formatCEP(cliente.cep) || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Data de Cadastro</p>
                            <p className="text-sm font-medium text-gray-900">{formatarData(cliente.dataCadastro)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contracts */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Contratos ({clienteContratos.length})
                        </h4>
                        {clienteContratos.length === 0 ? (
                          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">Nenhum contrato cadastrado para este cliente</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate('/cadastrar-contrato', { state: { clienteSelecionado: cliente } })
                              }}
                              className="mt-3 inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Adicionar Contrato
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {clienteContratos.map((contrato) => {
                              const statusInfo = formatarStatus(contrato.status)
                              return (
                                <div key={contrato.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h5 className="font-semibold text-gray-900">{contrato.titulo}</h5>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                          {statusInfo.label}
                                        </span>
                                      </div>

                                      {contrato.descricao && (
                                        <p className="mt-2 text-sm text-gray-600">{contrato.descricao}</p>
                                      )}
                                    </div>
                                    <div className="ml-4 flex flex-col space-y-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditarContrato(contrato, cliente)
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar contrato"
                                      >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setContratoParaExcluir(contrato)
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir contrato"
                                      >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de Confirmação de Exclusão */}
      {contratoParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">
              Confirmar Exclusão
            </h3>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Tem certeza que deseja excluir o contrato <strong>"{contratoParaExcluir.titulo}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setContratoParaExcluir(null)}
                disabled={excluindo}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirContrato}
                disabled={excluindo}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {excluindo ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientesContratos
