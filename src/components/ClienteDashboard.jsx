import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import contratoService from '../services/contratoService'
import clienteService from '../services/clienteService'

export default function ClienteDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [contratos, setContratos] = useState([])
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos') // todos, ativos, inativos

  useEffect(() => {
    if (!user || user.role !== 'cliente') {
      navigate('/cliente/login')
      return
    }
    carregarDados()
  }, [user, navigate])

  const carregarDados = async () => {
    try {
      setLoading(true)
      // Busca dados do cliente
      const clienteData = await clienteService.buscarPorId(user.clienteId)
      setCliente(clienteData)

      // Busca contratos do cliente
      const contratosData = await contratoService.buscarPorCliente(user.clienteId)
      setContratos(contratosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/cliente/login')
  }

  const contratosFiltrados = contratos.filter(contrato => {
    if (filtro === 'ativos') return contrato.status === 'ativo'
    if (filtro === 'inativos') return contrato.status !== 'ativo'
    return true
  })

  const estatisticas = {
    total: contratos.length,
    ativos: contratos.filter(c => c.status === 'ativo').length,
    inativos: contratos.filter(c => c.status !== 'ativo').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Portal do Cliente</h1>
              <p className="text-sm text-gray-600 mt-1">{cliente?.razaoSocial}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações do Cliente */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">CNPJ</p>
              <p className="font-medium text-gray-800">{cliente?.cnpj}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{cliente?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-medium text-gray-800">{cliente?.telefone || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Contratos</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{estatisticas.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Ativos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{estatisticas.ativos}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Inativos</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{estatisticas.inativos}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({estatisticas.total})
            </button>
            <button
              onClick={() => setFiltro('ativos')}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === 'ativos'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ativos ({estatisticas.ativos})
            </button>
            <button
              onClick={() => setFiltro('inativos')}
              className={`px-4 py-2 rounded-lg transition ${
                filtro === 'inativos'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inativos ({estatisticas.inativos})
            </button>
          </div>
        </div>

        {/* Lista de Contratos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Seus Contratos</h2>
          </div>

          {contratosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
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
              <p className="text-gray-600">Nenhum contrato encontrado</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contratosFiltrados.map((contrato) => (
                <div
                  key={contrato.id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/cliente/contrato/${contrato.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {contrato.titulo || 'Contrato sem título'}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contrato.status === 'ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contrato.status || 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {contrato.descricao || 'Sem descrição'}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          Criado em: {new Date(contrato.dataCadastro).toLocaleDateString('pt-BR')}
                        </span>
                        {contrato.dataVigencia && (
                          <span>
                            Vigência: {new Date(contrato.dataVigencia).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
