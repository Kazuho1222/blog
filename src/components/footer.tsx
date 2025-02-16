import styles from '../styles/footer.module.css'
import Container from './container'
import Logo from './logo'
import Social from './social'

export default function Footer() {
	return (
		<footer className={styles.wrapper}>
			<Container large={false}>
				<div className={styles.flexContainer}>
					<Logo />
					<Social />
				</div>
			</Container>
		</footer>
	)
}
