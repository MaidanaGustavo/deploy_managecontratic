import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import {
  Table, TableCell, TableHeader, TableRow
} from '@tiptap/extension-table'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, Link2, Table as TableIcon,
  Heading1, Heading2, Heading3, Minus, Undo, Redo,
  Highlighter, Type, ChevronDown
} from 'lucide-react'
import clienteService from '../services/clienteService'
import contratoService from '../services/contratoService'
import VariableNode from '../extensions/VariableNode'
import '../editor.css'

function CadastrarContrato() {
  const navigate = useNavigate()
  const location = useLocation()
  const [clientes, setClientes] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('ativo')
  const [dataVigencia, setDataVigencia] = useState('')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  // Configuração do editor TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      VariableNode,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<p>Digite o conteúdo do contrato aqui...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4 max-w-none',
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

  // Funções auxiliares para o editor
  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

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

    if (dataVigencia && new Date(dataVigencia) < new Date()) {
      setErro('A data de vigência não pode ser no passado')
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
        descricao: descricao.trim(),
        status,
        conteudo: editor.getHTML(),
        dataVigencia: dataVigencia || null
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
              minLength={3}
              maxLength={200}
            />
          </div>

          {/* Descrição e Status */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição sobre o contrato (opcional)"
                rows="3"
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vigência
                </label>
                <input
                  type="date"
                  value={dataVigencia}
                  onChange={(e) => setDataVigencia(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Data limite de validade do contrato</p>
              </div>
            </div>
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

            {/* Barra de ferramentas do editor - Estilo Word */}
            <div className="border border-gray-300 rounded-t-md bg-gradient-to-b from-gray-50 to-gray-100 p-3 space-y-3">

              {/* Primeira linha: Desfazer/Refazer, Estilos e Formatação de Texto */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Undo/Redo */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor?.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Desfazer"
                  >
                    <Undo size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor?.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Refazer"
                  >
                    <Redo size={18} />
                  </button>
                </div>

                {/* Headings */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                      editor?.isActive('paragraph') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Parágrafo Normal"
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Título 1"
                  >
                    <Heading1 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Título 2"
                  >
                    <Heading2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Título 3"
                  >
                    <Heading3 size={18} />
                  </button>
                </div>

                {/* Text Formatting */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Negrito (Ctrl+B)"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Itálico (Ctrl+I)"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Sublinhado (Ctrl+U)"
                  >
                    <UnderlineIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('strike') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Tachado"
                  >
                    <Strikethrough size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('code') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Código"
                  >
                    <Code size={18} />
                  </button>
                </div>

                {/* Colors */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <div className="flex items-center gap-1">
                    <Type size={16} className="text-gray-600" />
                    <input
                      type="color"
                      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                      className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                      title="Cor do Texto"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Highlighter size={16} className="text-gray-600" />
                    <input
                      type="color"
                      onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                      className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                      title="Cor de Destaque"
                    />
                  </div>
                </div>

                {/* Text Alignment */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Alinhar à Esquerda"
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Centralizar"
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Alinhar à Direita"
                  >
                    <AlignRight size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive({ textAlign: 'justify' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Justificar"
                  >
                    <AlignJustify size={18} />
                  </button>
                </div>
              </div>

              {/* Segunda linha: Listas, Links, Tabelas e Outros */}
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-300">
                {/* Lists */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Lista com Marcadores"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Lista Numerada"
                  >
                    <ListOrdered size={18} />
                  </button>
                </div>

                {/* Blockquote and HR */}
                <div className="flex gap-1 pr-2 border-r border-gray-300">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded transition ${
                      editor?.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Citação"
                  >
                    <Quote size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-2 rounded bg-white text-gray-700 hover:bg-gray-200 transition"
                    title="Linha Horizontal"
                  >
                    <Minus size={18} />
                  </button>
                </div>

                {/* Link */}
                <div className="flex gap-1 pr-2 border-r border-gray-300 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (editor.isActive('link')) {
                        removeLink()
                      } else {
                        setShowLinkInput(!showLinkInput)
                      }
                    }}
                    className={`p-2 rounded transition ${
                      editor?.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Inserir Link"
                  >
                    <Link2 size={18} />
                  </button>
                  {showLinkInput && (
                    <div className="flex gap-1 items-center">
                      <input
                        type="url"
                        placeholder="https://exemplo.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setLink()}
                        className="px-2 py-1 text-sm border border-gray-300 rounded w-48"
                      />
                      <button
                        type="button"
                        onClick={setLink}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLinkInput(false)}
                        className="px-2 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={insertTable}
                    className="p-2 rounded bg-white text-gray-700 hover:bg-gray-200 transition"
                    title="Inserir Tabela (3x3)"
                  >
                    <TableIcon size={18} />
                  </button>
                  {editor?.isActive('table') && (
                    <>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().addColumnBefore().run()}
                        className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-200"
                        title="Adicionar Coluna Antes"
                      >
                        +Col
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().addRowBefore().run()}
                        className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-200"
                        title="Adicionar Linha Antes"
                      >
                        +Row
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        title="Excluir Tabela"
                      >
                        Del
                      </button>
                    </>
                  )}
                </div>
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
