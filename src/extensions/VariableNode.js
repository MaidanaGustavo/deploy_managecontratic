import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import VariableComponent from './VariableComponent'

export const VariableNode = Node.create({
  name: 'variable',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-id': attributes.id,
          }
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {}
          }
          return {
            'data-label': attributes.label,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-type': 'variable' }, HTMLAttributes), `{{${HTMLAttributes['data-label']}}}`]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent)
  },

  addCommands() {
    return {
      setVariable: attributes => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('autoConvertVariables'),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some(transaction => transaction.docChanged)
          if (!docChanged) return null

          let tr = newState.tr
          let modified = false

          // Regex para detectar padrão {{texto}}
          const variableRegex = /\{\{([^}]+)\}\}/g

          newState.doc.descendants((node, pos) => {
            if (!node.isText || !node.text) return

            let match
            // Find all matches first
            const matches = []
            while ((match = variableRegex.exec(node.text)) !== null) {
              matches.push({
                start: pos + match.index,
                end: pos + match.index + match[0].length,
                text: match[1].trim()
              })
            }

            // Apply in reverse to maintain positions
            for (let i = matches.length - 1; i >= 0; i--) {
              const { start, end, text } = matches[i]

              const variableNode = this.type.create({
                id: text.toLowerCase().replace(/\s+/g, '_'),
                label: text,
              })

              // Simply replace the text with the variable node
              tr = tr.replaceWith(start, end, variableNode)
              modified = true
            }
          })

          return modified ? tr : null
        },
      }),
    ]
  },
})

export default VariableNode
