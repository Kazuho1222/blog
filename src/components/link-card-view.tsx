'use client'

import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import LinkCard from './link-card'

const LinkCardView = (props: NodeViewProps) => {
  const { url } = props.node.attrs as { url: string }

  return (
    <NodeViewWrapper>
      <LinkCard url={url} />
    </NodeViewWrapper>
  )
}

export default LinkCardView
