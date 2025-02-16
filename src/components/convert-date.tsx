import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function ConvertDate({ dateISO }: { dateISO: string }) {
	return (
		<time dateTime={dateISO}>
			{format(parseISO(dateISO), 'yyyy年MM月dd日', {
				locale: ja,
			})}
		</time>
	)
}
