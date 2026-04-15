import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import LinkCardView from '../link-card-view'

// URLを検知するための正規表現 (末尾にスペースを想定)
const inputRegex = /(?:^|\s)(https?:\/\/[^\s]+)\s$/

export const LinkCard = Node.create({
  name: 'linkCard',
  group: 'block', // ブロック要素として扱う
  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-type="link-card"]',
      },
      {
        // <a>タグで、中身のテキストがhrefと同じ場合（自動リンクされたもの）をカードとして認識
        tag: 'a',
        getAttrs: (element) => {
          if (element instanceof HTMLElement) {
            const href = element.getAttribute('href')
            const text = element.innerText.trim()
            if (href && text && href.startsWith('http')) {
              // 末尾のスラッシュの違いを無視して比較
              const normalize = (url: string) => url.replace(/\/$/, '')
              if (normalize(href) === normalize(text)) {
                return { url: href }
              }
            }
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // 保存時は「URLをテキストに持つ普通のリンク」として出力する
    // これならMicroCMSに消されることはない
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        href: HTMLAttributes.url,
        'data-type': 'link-card',
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
      HTMLAttributes.url || '',
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          return { url: match[1] }
        },
      }),
    ]
  },
})
