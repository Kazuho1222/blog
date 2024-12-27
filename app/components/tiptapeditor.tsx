import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from '../../styles/tiptap-editor.module.css'
import RichEditorToolbar from './rich-editor-toolbar'

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