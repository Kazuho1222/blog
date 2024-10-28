import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import RichEditorToolbar from './rich-editor-toolbar'
import Underline from '@tiptap/extension-underline'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
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