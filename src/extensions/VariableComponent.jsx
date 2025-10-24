import { NodeViewWrapper } from '@tiptap/react'

export default function VariableComponent({ node }) {
  return (
    <NodeViewWrapper
      as="span"
      className="inline items-center px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300"
      contentEditable={false}
      style={{ display: 'inline', whiteSpace: 'nowrap' }}
    >
      {`{{${node.attrs.label}}}`}
    </NodeViewWrapper>
  )
}
