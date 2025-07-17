import Image from 'next/image';
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
		<div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
			<div className="flex-1 pt-8 pb-10 text-center md:pt-12 md:pb-14 md:text-left">
				<h1 className="mb-4 font-black text-4xl text-gray-900 leading-tight tracking-wider md:text-6xl lg:text-8xl">
					{title}
				</h1>
				<p className="text-gray-600 text-lg leading-relaxed md:text-xl lg:text-2xl">
					{subtitle}
				</p>
			</div>
			{imageOn && (
				<figure className="w-full max-w-sm flex-shrink-0 md:w-2/5 md:max-w-md">
					<Image
						src={cube}
						alt="Hero image"
						width={500}
						height={400}
						sizes="(min-width: 768px) 45vw, 300px"
						priority
						placeholder="blur"
						className="h-auto w-full rounded-lg"
					/>
				</figure>
			)}
		</div>
	)
}
