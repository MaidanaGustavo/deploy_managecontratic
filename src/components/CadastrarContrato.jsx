import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clienteService from '../services/clienteService'
import contratoService from '../services/contratoService'
import VariableNode from '../extensions/VariableNode'

function CadastrarContrato() {
  const navigate = useNavigate()
  const location = useLocation()
  const [clientes, setClientes] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState('')
  const [titulo, setTitulo] = useState('')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // Configuração do editor TipTap
  const editor = useEditor({
    extensions: [StarterKit, VariableNode],
    content: '<p>Digite o conteúdo do contrato aqui...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  // Carregar clientes ao montar o componente
  useEffect(() => {
    carregarClientes()
  }, [])

  // Verificar se há um cliente pré-selecionado vindo da navegação
  useEffect(() => {
    if (location.state?.clienteSelecionado) {
      const cliente = location.state.clienteSelecionado
      setClienteSelecionado(cliente.id)
      setBusca(cliente.razaoSocial)

      // Limpa o estado da navegação
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const carregarClientes = async () => {
    try {
      const dados = await clienteService.listar()
      setClientes(dados)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setErro('Erro ao carregar lista de clientes')
    }
  }

  // Filtrar clientes pela busca
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cnpj.includes(busca)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // Validações
    if (!titulo.trim()) {
      setErro('O título do contrato é obrigatório')
      return
    }

    if (!clienteSelecionado) {
      setErro('Selecione um cliente')
      return
    }

    if (!editor || editor.isEmpty) {
      setErro('O conteúdo do contrato não pode estar vazio')
      return
    }

    setLoading(true)

    try {
      const contratoData = {
        clienteId: clienteSelecionado,
        titulo: titulo.trim(),
        conteudo: editor.getHTML()
      }

      await contratoService.criar(contratoData)
      setSucesso('Contrato cadastrado com sucesso!')

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      setErro(error.message || 'Erro ao cadastrar contrato')
    } finally {
      setLoading(false)
    }
  }

  const clienteSelecionadoObj = clientes.find(c => c.id === clienteSelecionado)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Contrato</h1>
        </div>

        {/* Mensagens de erro e sucesso */}
        {erro && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título do Contrato */}
          <div className="bg-white shadow rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Contrato *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Contrato de Prestação de Serviços"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Seleção de Cliente */}
          <div className="bg-white shadow rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>

            {/* Campo de busca */}
            <input
              type="text"
              placeholder="Buscar cliente por razão social ou CNPJ..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Select de clientes */}
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientesFiltrados.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.razaoSocial} - CNPJ: {cliente.cnpj}
                </option>
              ))}
            </select>

            {/* Informações do cliente selecionado */}
            {clienteSelecionadoObj && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">Cliente Selecionado:</h3>
                <p className="text-sm text-blue-800">
                  <strong>Razão Social:</strong> {clienteSelecionadoObj.razaoSocial}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>CNPJ:</strong> {clienteSelecionadoObj.cnpj}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Email:</strong> {clienteSelecionadoObj.email}
                </p>
              </div>
            )}
          </div>

          {/* Editor de Contrato */}
          <div className="bg-white shadow rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Contrato *
            </label>

            {/* Barra de ferramentas do editor */}
            <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  • Lista
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`px-3 py-1 rounded ${
                    editor?.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } border border-gray-300 hover:bg-blue-100`}
                >
                  1. Lista
                </button>
              </div>

              {/* Instruções de Variáveis Dinâmicas */}
              <div className="border-t border-gray-300 pt-2">
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <p className="text-xs font-semibold text-purple-900 mb-1">
                    💡 Dica: Crie variáveis dinâmicas
                  </p>
                  <p className="text-xs text-purple-700">
                    Digite <code className="bg-purple-100 px-1 rounded">{"{{nome_da_variavel}}"}</code> no texto e ela será automaticamente convertida em uma variável destacada.
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Exemplos: <code className="bg-purple-100 px-1 rounded">{"{{nome_cliente}}"}</code>, <code className="bg-purple-100 px-1 rounded">{"{{data_contrato}}"}</code>, <code className="bg-purple-100 px-1 rounded">{"{{valor_total}}"}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Área do editor */}
            <div className="border border-t-0 border-gray-300 rounded-b-md bg-white">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CadastrarContrato
