import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from '../styles/tiptap-editor.module.css'
import RichEditorToolbar from './rich-editor-toolbar'

interface TiptapEditorProps {
	content: string
	onChange: (content: string) => void
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
				HTMLAttributes: { class: styles.link },
			}),
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
