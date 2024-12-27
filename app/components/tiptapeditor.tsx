import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import RichEditorToolbar from './rich-editor-toolbar'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import styles from '../../styles/tiptap-editor.module.css'
import CodeBlock from '@tiptap/extension-code-block'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: { class: styles.link },
    })
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
        class: "prose prose-base m-5 focus:outline-none text-left",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="mt-10 mx-auto border-gray-500 border-2">
      <RichEditorToolbar editor={editor} />
      <div className='p-3 overflow-y-scroll h-[70vh] overflow-hidden mt-3'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TiptapEditor