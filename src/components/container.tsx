import type { ReactNode } from 'react'
import styles from '../styles/container.module.css'

export default function Container({
	children,
	large = false,
}: { children: ReactNode; large: boolean }) {
	return <div className={large ? styles.large : styles.default}>{children}</div>
}
