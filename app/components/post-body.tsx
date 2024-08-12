import React, { ReactNode } from 'react'
import styles from '../../styles/post-body.module.css'

export default function PostBody({ children }: { children: ReactNode }) {
  return (
    <div className={styles.stack}>{children}</div>
  )
}