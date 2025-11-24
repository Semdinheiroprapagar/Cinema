import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.socials}>
            {/* Social Icons Placeholder */}
            <span>Socials</span>
          </div>
          <div className={styles.search}>
            {/* Search Placeholder */}
            <span>Search</span>
          </div>
        </div>
        <div className={styles.mainNav}>
          <Link href="/" className={styles.logo}>
            MEIO AMARGO
          </Link>
          <nav className={styles.nav}>
            <Link href="/category/criticas">Críticas</Link>
            <Link href="/category/artigos">Artigos</Link>
            <Link href="/category/videos">Vídeos</Link>
            <Link href="/category/festivais">Festivais</Link>
            <Link href="/category/temas">Temas</Link>
            <Link href="/about">Quem Sou</Link>
            <Link href="/contact">Contato</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
