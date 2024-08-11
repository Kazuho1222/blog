import Container from '../components/container'
import Hero from '../components/hero'

export default function Blog() {
  return (
    <Container large={false}>
      <Hero
        title='Blog'
        subtitle='Recent Posts'
        imageOn={false} />
    </Container>
  )
}