import parse, { type DOMNode, Element, Text } from 'html-react-parser'
import Image from 'next/image'
import LinkCard from './link-card'

export default function ConvertBody({ contentHTML }: { contentHTML: string }) {
  // contentHTMLが文字列でない場合は空の文字列を使用
  const safeContentHTML = typeof contentHTML === 'string' ? contentHTML : ''

  const contentReact = parse(safeContentHTML, {
    replace: (node: DOMNode) => {
      // タグ（Element）の場合のみ処理
      if (node instanceof Element) {
        // テキストコンテンツを再帰的に抽出する共通関数
        const getText = (nodes: DOMNode[]): string => {
          if (!nodes) return ''
          return nodes.reduce((acc: string, child: DOMNode) => {
            if (child instanceof Text) return acc + child.data
            if (child instanceof Element)
              return acc + getText(child.children as DOMNode[])
            return acc
          }, '')
        }

        const textContent = getText(node.children as DOMNode[]).trim()
        const isUrl = /^https?:\/\/[^\s]+$/.test(textContent)
        const href = node.attribs?.href

        // 1. <a>タグまたは<p>タグで、中身が単一のURLである場合
        // 2. data-type="link-card" を持っている場合
        const isLinkCard =
          node.attribs?.['data-type'] === 'link-card' ||
          ((node.name === 'a' || node.name === 'p') && isUrl)

        if (isLinkCard) {
          const url = href || textContent
          return <LinkCard url={url} />
        }

        // 画像の置換
        if (node.name === 'img') {
          const { src, alt, width, height } = node.attribs
          if (src && alt && width && height) {
            return (
              <Image
                src={src}
                width={Number.parseInt(width, 10)}
                height={Number.parseInt(height, 10)}
                alt={alt}
                sizes="(min-width:768px)768px,100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            )
          }
        }
      }
    },
  })
  return <>{contentReact}</>
}
