import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import styles from '../styles/pagination.module.css'

export default function pagination({
  prevText = '',
  prevUrl = '',
  nextText = '',
  nextUrl = '',
}) {
  return (
    <ul className={styles.flexContainer}>
      {prevText && prevUrl && (
        <li className={styles.prev}>
          <Link href={prevUrl}>
            <div className={styles.iconText}>
              <FontAwesomeIcon icon={faChevronLeft} color="var(--gray-25)" />
              <span>{prevText}</span>
            </div>
          </Link>
        </li>
      )}
      {nextText && nextUrl && (
        <li className={styles.next}>
          <Link href={nextUrl}>
            <div className={styles.iconText}>
              <span>{nextText}</span>
              <FontAwesomeIcon icon={faChevronRight} color="var(--gray-25)" />
            </div>
          </Link>
        </li>
      )}
    </ul>
  )
}
