import parse, { Element } from 'html-react-parser';
import Image from 'next/image';

export default function ConvertBody({ contentHTML }: { contentHTML: string }) {
  // contentHTMLが文字列でない場合は空の文字列を使用
  const safeContentHTML = typeof contentHTML === 'string' ? contentHTML : '';

  const contentReact = parse(safeContentHTML, {
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