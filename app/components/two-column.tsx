import type { ReactNode } from 'react'
import styles from '../../styles/two-column.module.css'

export function TwoColumn({ children }: { children: ReactNode }) {
  return (
    <div className={styles.flexContainer}>{children}</div>
  )
}

export function TwoColumnMain({ children }: { children: ReactNode }) {
  return (
    <div className={styles.main}>{children}</div>
  )
}

export function TwoColumnSidebar({ children }: { children: ReactNode }) {
  return (
    <div className={styles.sidebar}>{children}</div>
  )
}