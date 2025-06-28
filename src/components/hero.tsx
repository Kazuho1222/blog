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
		<div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
			<div className="flex-1 text-center md:text-left pt-8 pb-10 md:pt-12 md:pb-14">
				<h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-wider leading-tight mb-4 text-gray-900">
					{title}
				</h1>
				<p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600">
					{subtitle}
				</p>
			</div>
			{imageOn && (
				<figure className="w-full max-w-sm md:w-2/5 md:max-w-md flex-shrink-0">
					<Image
						src={cube}
						alt="Hero image"
						width={500}
						height={400}
						sizes="(min-width: 768px) 45vw, 300px"
						priority
						placeholder="blur"
						className="w-full h-auto rounded-lg"
					/>
				</figure>
			)}
		</div>
	)
}
