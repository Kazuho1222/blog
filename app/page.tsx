import Container from "./components/container"
import Hero from "./components/hero"
import Meta from "./components/meta"

export default function Home() {
  return (
    <>
      <main>
        <Container large={false}>
          <Meta pageTitle={""} pageDesc={""} />
          <Hero
            title="CUBE"
            subtitle="アウトプットしていくサイト"
            imageOn
          />
        </Container>
      </main>
    </>
  )
}
