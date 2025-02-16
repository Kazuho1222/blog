import {
	faBold,
	faCode,
	faHeading,
	faItalic,
	faLink,
	faList,
	faListOl,
	faQuoteRight,
	faRedo,
	faStrikethrough,
	faUnderline,
	faUndo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Editor } from '@tiptap/react'
import { useCallback } from 'react'

const RichEditorToolbar = ({ editor }: { editor: Editor }) => {
	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href
		const url = window.prompt('URL', previousUrl)
		//cancelled
		if (url === null) {
			return
		}
		//empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
			return
		}
		//update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
		console.log('Current editor HTML:', editor.getHTML())
	}, [editor])

	if (!editor) {
		return null
	}

	return (
		<div className="flex flex-wrap gap-2 border-gray-600 border-b p-4 text-2xl">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={
					!editor.isActive('heading', { level: 1 }) ? 'opacity-20' : ''
				}
			>
				<FontAwesomeIcon icon={faHeading} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={!editor.isActive('bold') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faBold} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={!editor.isActive('italic') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faItalic} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={!editor.isActive('underline') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faUnderline} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={!editor.isActive('strike') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faStrikethrough} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={!editor.isActive('codeBlock') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faCode} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={!editor.isActive('bulletList') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faList} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={!editor.isActive('orderedList') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faListOl} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={!editor.isActive('blockquote') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faQuoteRight} />
			</button>
			<button
				type="button"
				onClick={setLink}
				className={!editor.isActive('link') ? 'opacity-20' : ''}
			>
				<FontAwesomeIcon icon={faLink} />
			</button>
			<button onClick={() => editor.chain().focus().undo().run()} type="button">
				<FontAwesomeIcon icon={faUndo} />
			</button>
			<button onClick={() => editor.chain().focus().redo().run()} type="button">
				<FontAwesomeIcon icon={faRedo} />
			</button>
		</div>
	)
}

export default RichEditorToolbar
