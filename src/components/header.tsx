import styles from '../styles/header.module.css'
import Container from './container'
import Logo from './logo'
import Nav from './nav'

export default function Header() {
	return (
		<header>
			<Container large={false}>
				<div className={styles.flexContainer}>
					<Logo boxOn />
					<Nav />
				</div>
			</Container>
		</header>
	)
}
