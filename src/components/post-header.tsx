import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/post-header.module.css'
import ConvertDate from './convert-date'

export default function PostHeader({
	title,
	subtitle,
	publish = '',
}: { title: string; subtitle: string; publish: string }) {
	return (
		<div className={styles.stack}>
			<p className={styles.subtitle}>{subtitle}</p>
			<h1 className={styles.title}>{title}</h1>
			{publish && (
				<div className={styles.publish}>
					<FontAwesomeIcon icon={faClock} size="lg" color="var(--gray-25)" />
					<ConvertDate dateISO={publish} />
				</div>
			)}
		</div>
	)
}
