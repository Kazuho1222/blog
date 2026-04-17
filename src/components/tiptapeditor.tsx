'use client'

import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import styles from '../styles/tiptap-editor.module.css'
import { LinkCard } from './extensions/link-card'
import RichEditorToolbar from './rich-editor-toolbar'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      Strike,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      Underline,
      History,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: { class: styles.link },
      }),
      LinkCard,
    ],
    content,
    immediatelyRender: false, // SSRの問題回避
    onUpdate: ({ editor }) => {
      if (editor) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-base m-5 focus:outline-none text-left',
      },
      // URLが貼り付けられた際の自動カード化ロジック
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain')
        if (!text) return false

        // シンプルなURL正規表現
        const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/gm
        if (urlRegex.test(text)) {
          const { state, dispatch } = view
          const { selection } = state
          const { from, to } = selection

          // URLをリンクカードとして挿入
          const node = state.schema.nodes.linkCard.create({ url: text })
          const transaction = state.tr.replaceWith(from, to, node)
          dispatch(transaction)
          return true // デフォルトの貼り付け動作をキャンセル
        }
        return false
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="mx-auto mt-10 border-2 border-gray-500">
      <RichEditorToolbar editor={editor} />
      <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TiptapEditor
