import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConvertDate from './convert-date';

export default function PostHeader({
	title,
	subtitle,
	publish = '',
}: { title: string; subtitle: string; publish: string }) {
	return (
		<div className="space-y-4 py-6">
			<p className="font-bold text-gray-600 text-lg md:text-xl">{subtitle}</p>
			<h1 className="font-bold text-3xl text-gray-900 leading-tight md:text-4xl lg:text-5xl">
				{title}
			</h1>
			{publish && (
				<div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
					<FontAwesomeIcon icon={faClock} size="lg" className="text-gray-400" />
					<ConvertDate dateISO={publish} />
				</div>
			)}
		</div>
	)
}
