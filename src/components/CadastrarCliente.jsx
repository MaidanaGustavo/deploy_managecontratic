import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteService from '../services/clienteService'
import { maskCNPJ, unmaskCNPJ, isValidCNPJ, maskTelefone } from '../utils/maskUtils'

function CadastrarCliente() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cnpjError, setCnpjError] = useState('')
  const [senhaGerada, setSenhaGerada] = useState(null)
  const [senhaCopied, setSenhaCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'cnpj') {
      // Aplica a máscara ao CNPJ
      const maskedValue = maskCNPJ(value)
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }))

      // Limpa erro ao digitar
      if (cnpjError) setCnpjError('')
    } else if (name === 'telefone') {
      // Aplica a máscara ao telefone
      const maskedValue = maskTelefone(value)
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Limpa erro geral ao digitar
    if (error) setError('')
  }

  const handlePaste = (e) => {
    if (e.target.name === 'cnpj') {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')
      const maskedValue = maskCNPJ(pastedText)

      setFormData(prev => ({
        ...prev,
        cnpj: maskedValue
      }))

      // Limpa erro ao colar
      if (cnpjError) setCnpjError('')
      if (error) setError('')
    } else if (e.target.name === 'telefone') {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')
      const maskedValue = maskTelefone(pastedText)

      setFormData(prev => ({
        ...prev,
        telefone: maskedValue
      }))

      // Limpa erro ao colar
      if (error) setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCnpjError('')

    // Valida CNPJ
    if (!isValidCNPJ(formData.cnpj)) {
      setCnpjError('CNPJ inválido')
      return
    }

    setLoading(true)

    try {
      // Prepara dados para salvar (sem máscara no CNPJ e telefone)
      const clienteData = {
        razaoSocial: formData.razaoSocial.trim(),
        cnpj: unmaskCNPJ(formData.cnpj),
        email: formData.email.trim(),
        telefone: formData.telefone.replace(/\D/g, ''), // Remove máscara do telefone
        endereco: formData.endereco.trim()
      }

      const response = await clienteService.criar(clienteData)

      // Captura a senha gerada pelo backend
      if (response.senhaGerada) {
        setSenhaGerada(response.senhaGerada)
      }
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar cliente')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  const handleCloseModal = () => {
    navigate('/dashboard', {
      state: {
        message: 'Cliente cadastrado com sucesso!',
        type: 'success'
      }
    })
  }

  const handleCopySenha = () => {
    if (senhaGerada) {
      navigator.clipboard.writeText(senhaGerada)
      setSenhaCopied(true)
      setTimeout(() => setSenhaCopied(false), 2000)
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
                onClick={handleCancel}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CM</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800">ContraticManage</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cadastrar Novo Cliente</h1>
                <p className="text-blue-100 text-sm">Preencha os dados do cliente abaixo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao cadastrar cliente</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Razão Social */}
            <div>
              <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-2">
                Razão Social *
              </label>
              <input
                type="text"
                id="razaoSocial"
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Digite a razão social da empresa"
              />
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ *
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                onPaste={handlePaste}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 ${
                  cnpjError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="00.000.000/0000-00"
                maxLength="18"
              />
              {cnpjError ? (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cnpjError}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Formato: 00.000.000/0000-00</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="exemplo@empresa.com"
              />
              <p className="mt-1 text-sm text-gray-500">Email será usado para login do cliente. Uma senha padrão será gerada automaticamente.</p>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                onPaste={handlePaste}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="(00) 00000-0000"
                maxLength="15"
              />
              <p className="mt-1 text-sm text-gray-500">Formato: (00) 00000-0000</p>
            </div>

            {/* Endereço */}
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Rua, número, bairro, cidade - Estado"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <span>Cadastrar Cliente</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Informação</h3>
              <p className="mt-1 text-sm text-blue-700">
                Campos obrigatórios (*): Razão Social, CNPJ e Email. Uma senha padrão será gerada automaticamente para o cliente.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Senha Gerada */}
      {senhaGerada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
              Cliente Cadastrado com Sucesso!
            </h3>

            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-800">Senha de Acesso Gerada</h4>
                  <p className="mt-1 text-xs text-yellow-700">
                    Anote ou copie esta senha. Ela será necessária para o cliente acessar o sistema.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-300">
                <div className="flex items-center space-x-2 flex-1">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <code className="text-lg font-mono font-bold text-gray-900">{senhaGerada}</code>
                </div>
                <button
                  onClick={handleCopySenha}
                  className="ml-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  {senhaCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Senha:</strong> {senhaGerada}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Fechar e Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastrarCliente
