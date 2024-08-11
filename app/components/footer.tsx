import React from 'react'
import Logo from './logo'
import styles from '../../styles/footer.module.css'
import Container from './container'

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <Container large={false} >
        <div className={styles.flexContainer}>
          <Logo />
          [ソーシャル]
        </div>
      </Container>
    </footer>
  )
}
