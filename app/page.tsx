import Container from "./components/container"
import Hero from "./components/hero"

export default function Home() {
  return (
    <>
      <main>
        <Container large={false}>
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
