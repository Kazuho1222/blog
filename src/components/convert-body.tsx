import parse, { type DOMNode, Element, Text } from 'html-react-parser'
import Image from 'next/image'
import LinkCard from './link-card'

export default function ConvertBody({ contentHTML }: { contentHTML: string }) {
  // contentHTMLが文字列でない場合は空の文字列を使用
  const safeContentHTML = typeof contentHTML === 'string' ? contentHTML : ''

  const contentReact = parse(safeContentHTML, {
    replace: (node: DOMNode) => {
      // タグ（Element）の場合のみ処理
      if (node instanceof Element || ('name' in node && 'attribs' in node)) {
        const element = node as Element
        const nodeName = element.name.toLowerCase()

        // テキストコンテンツを再帰的に抽出する共通関数
        const getText = (nodes: DOMNode[]): string => {
          if (!nodes) return ''
          return nodes.reduce((acc: string, child: DOMNode) => {
            if (
              child instanceof Text ||
              ('data' in child && !('name' in child))
            ) {
              return acc + (child as Text).data
            }
            if (
              child instanceof Element ||
              ('name' in child && 'children' in child)
            ) {
              return acc + getText((child as Element).children as DOMNode[])
            }
            return acc
          }, '')
        }

        const textContent = getText(element.children as DOMNode[]).trim()
        const isUrl = /^https?:\/\/[^\s]+$/.test(textContent)
        const href = element.attribs?.href

        // 1. <a>タグまたは<p>タグで、中身が単一のURLである場合
        // 2. data-type="link-card" を持っている場合
        const isLinkCard =
          element.attribs?.['data-type'] === 'link-card' ||
          ((nodeName === 'a' || nodeName === 'p') && isUrl)

        if (isLinkCard) {
          const url = href || textContent
          if (url && /^https?:\/\/[^\s]+$/.test(url)) {
            return <LinkCard url={url} />
          }
        }

        // 画像の置換
        if (nodeName === 'img') {
          const { src, alt, width, height } = element.attribs
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
