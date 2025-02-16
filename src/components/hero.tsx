import Image from 'next/image'
import styles from '../styles/hero.module.css'
// import cube from '../images/cube.jpg'

const cube = {
	src: 'https://images.microcms-assets.io/assets/93b42a5f4a114f00b170397593b04592/a79ac87ccafc4de0926773b09a954ae1/cube.jpg',
	height: 1300,
	width: 1500,
	blurDataURL: 'data:image/jpeg;base64,',
}

export default function Hero({
	title,
	subtitle,
	imageOn = false,
}: { title: string; subtitle: string; imageOn: boolean }) {
	return (
		<div className={styles.flexContainer}>
			<div className={styles.text}>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.subtitle}>{subtitle}</p>
			</div>
			{imageOn && (
				<figure className={styles.image}>
					<Image
						src={cube}
						alt=""
						// layout="responsive"
						sizes="(min-width:1152px)576px,(min-width:768px)50vw,100vw"
						priority
						placeholder="blur"
					/>
				</figure>
			)}
		</div>
	)
}
