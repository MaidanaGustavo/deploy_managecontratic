import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import contratoService from '../services/contratoService'
import VariableNode from '../extensions/VariableNode'

function EditarContrato() {
  const navigate = useNavigate()
  const location = useLocation()
  const { contrato, cliente } = location.state || {}

  const [titulo, setTitulo] = useState(contrato?.titulo || '')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // Configuração do editor TipTap
  const editor = useEditor({
    extensions: [StarterKit, VariableNode],
    content: contrato?.conteudo || '<p>Digite o conteúdo do contrato aqui...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  useEffect(() => {
    if (!contrato || !cliente) {
      setErro('Dados do contrato não encontrados')
      setTimeout(() => navigate('/clientes-contratos'), 2000)
    }
  }, [contrato, cliente, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // Validações
    if (!titulo.trim()) {
      setErro('O título do contrato é obrigatório')
      return
    }

    if (!editor || editor.isEmpty) {
      setErro('O conteúdo do contrato não pode estar vazio')
      return
    }

    setLoading(true)

    try {
      const contratoData = {
        titulo: titulo.trim(),
        conteudo: editor.getHTML()
      }

      await contratoService.atualizar(contrato.id, contratoData)
      setSucesso('Contrato atualizado com sucesso!')

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/clientes-contratos')
      }, 2000)
    } catch (error) {
      setErro(error.message || 'Erro ao atualizar contrato')
    } finally {
      setLoading(false)
    }
  }

  if (!contrato || !cliente) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/clientes-contratos')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Voltar para Clientes e Contratos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Contrato</h1>
          <p className="mt-1 text-sm text-gray-500">Cliente: {cliente.razaoSocial}</p>
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

          {/* Informações do Cliente */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Cliente:</h3>
            <p className="text-sm text-gray-800">
              <strong>Razão Social:</strong> {cliente.razaoSocial}
            </p>
            <p className="text-sm text-gray-800">
              <strong>CNPJ:</strong> {cliente.cnpj}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Email:</strong> {cliente.email}
            </p>
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
              onClick={() => navigate('/clientes-contratos')}
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarContrato
