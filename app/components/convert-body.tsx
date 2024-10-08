import parse, { Element } from 'html-react-parser'
import Image from 'next/legacy/image'

export default function ConvertBody({ contentHTML }: { contentHTML: string }) {
  const contentReact = parse(contentHTML, {
    replace: (node) => {
      if (node instanceof Element && node.name === 'img') {
        const { src, alt, width, height } = node.attribs

        // src,alt,width,heightがすべて定義されている場合のみImageコンポネントを返す
        if (src && alt && width && height) {
          return (
            <Image
              // layout='responsive'
              src={src}
              width={parseInt(width, 10)}
              height={parseInt(height, 10)}
              alt={alt}
              sizes='(min-width:768px)768px,100vw'
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          )
        }
      }
    },
  })
  return <>{contentReact}</>
}