import Container from '../components/container'
import Hero from '../components/hero'

export default function NotFound() {
	return (
		<>
			<title>404: ページが見つかりません</title>
			<Container large={false}>
				<Hero title="404" subtitle="ページが見つかりません" imageOn={false} />
			</Container>
		</>
	)
}
