'use client'

import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import LinkCard from './link-card'

const LinkCardView = (props: NodeViewProps) => {
  const url = props.node.attrs?.url as string | undefined

  if (!url) {
    return null
  }

  return (
    <NodeViewWrapper>
      <LinkCard url={url} />
    </NodeViewWrapper>
  )
}

export default LinkCardView
