import Container from '../components/container'
import Hero from '../components/hero'

export const metadata = {
  title: '404: ページが見つかりません',
}

export default function NotFound() {
  return (
    <>
      <Container large={false}>
        <Hero title="404" subtitle="ページが見つかりません" imageOn={false} />
      </Container>
    </>
  )
}
