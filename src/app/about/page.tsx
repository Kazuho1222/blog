import Image from 'next/image'
// import eyecatch from '../images/about.jpg'
import Accordion from '../../components/accordion'
import Contact from '../../components/contact'
import Container from '../../components/container'
import Hero from '../../components/hero'
import PostBody from '../../components/post-body'
import {
	TwoColumn,
	TwoColumnMain,
	TwoColumnSidebar,
} from '../../components/two-column'
import { openGraphMetadata, twitterMetadata } from '../../lib/base-metadata'
import { siteMeta } from '../../lib/constants'
const { siteTitle, siteUrl } = siteMeta

const eyecatch = {
	src: 'https://images.microcms-assets.io/assets/93b42a5f4a114f00b170397593b04592/17d6566f7eb5485ba6c4ced763d06f8d/about.jpg',
	height: 960,
	width: 1920,
	blurDataURL: 'data:image/jpeg;base64,',
}

export default function About() {
	return (
		<Container large={false}>
			<Hero
				title="About"
				subtitle="About development activities"
				imageOn={false}
			/>

			<figure>
				<Image
					src={eyecatch}
					alt=""
					// layout='responsive'
					sizes="(min-width:1152px) 1152px,100vw"
					priority
					placeholder="blur"
				/>
			</figure>

			<TwoColumn>
				<TwoColumnMain>
					<PostBody>
						<p>
							Cubeが得意とする分野はモノづくりです。３次元から２次元の造形、プログラミングやデザインなど、さまざまな技術を組み合わせることによって社会や環境と結びづけるクリエイティブを提案し続けています。
						</p>
						<h2>モノづくりで目指していること</h2>
						<p>
							モノづくりではデータの解析からクリエイティブまで幅広いことを担当しています。新しいことを取り入れながら、ユーザーにマッチした提案を実現するのが目標です。たくさんの開発・提供が数多くありますが、特にそこを磨く作業に力をいれています。
						</p>
						<p>
							単純に形にするだけでなく、作る過程や、なぜそのようにしたのかを大事にしながらものづくりをしています。毎回課題解決テーマをもって「モノ」と向き合い制作をし、フィードバックしてもらうことで自分の中にあるモヤモヤを言葉にして「問い」への答えを出しています。
						</p>
						<h3>新しいことへのチャレンジ</h3>
						<p>
							今までと違くものを作ることで愛着が湧いてきます。そこで興味を持ったことは小さなことでもいいから取り入れて、良いものを作れるようにしています。小さなヒントから新しいものを生み出すようなモノづくりは、これからも続けていきたいです。
						</p>

						<h2>FAQ</h2>
						<Accordion heading="プログラミングのポイントについて">
							<p>
								プログラミングのポイントは、作りたいものを作ることです。楽しいことから思いつき、目標とゴールを決め、そこに向かってさまざまな課題を設定していきながら、プログラムを作っていきます。
							</p>
						</Accordion>
						<Accordion heading="古代語の解読について">
							<p>
								古代語を解読するのに必要なのは、書かれた文字そのものだけです。古代の世界観や思考方法。それらを読み取ってこそ古代の世界観が理解できてきます。
							</p>
						</Accordion>
						<Accordion heading="公開リポジトリの活用について">
							<p>
								公開リポジトリを活用すると、全世界のどこからでもアクセスし、開発者が関連するプロジェクトのタスクを利用することができます。
							</p>
						</Accordion>
					</PostBody>
				</TwoColumnMain>

				<TwoColumnSidebar>
					<Contact />
				</TwoColumnSidebar>
			</TwoColumn>
		</Container>
	)
}

// メタデータ
const pageTitle = 'アバウト'
const pageDesc = 'About development activities'
const ogpTitle = `${pageTitle} | ${siteTitle}`
const ogpUrl = new URL('/about', siteUrl).toString()

export const metadata = {
	title: pageTitle,
	description: pageDesc,

	openGraph: {
		...openGraphMetadata,
		title: ogpTitle,
		description: pageDesc,
		url: ogpUrl,
		images: [
			{
				url: eyecatch.src,
				width: eyecatch.width,
				height: eyecatch.height,
			},
		],
	},
	twitter: {
		...twitterMetadata,
		title: ogpTitle,
		description: pageDesc,
		images: [eyecatch.src],
	},
}
