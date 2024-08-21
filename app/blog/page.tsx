import Container from '../components/container'
import Hero from '../components/hero'
import Meta from '../components/meta'

export default function Blog() {
  return (
    <Container large={false}>
      <Meta pageTitle='ブログ' pageDesc='ブログの記事一覧' pageImg={undefined} pageImgW={undefined} pageImgH={undefined} />
      <Hero
        title='Blog'
        subtitle='Recent Posts'
        imageOn={false} />
    </Container>
  )
}