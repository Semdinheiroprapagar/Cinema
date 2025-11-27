'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image src="/logo.png" alt="Meio Amargo" width={120} height={60} className={styles.logoImage} />
          </Link>

          {/* Hamburger Button */}
          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Menu */}
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <Link href="/category/criticas" onClick={closeMenu}>Críticas</Link>
            <Link href="/category/listas" onClick={closeMenu}>Listas</Link>
            <Link href="/category/curiosidades" onClick={closeMenu}>Curiosidades</Link>
            <Link href="/category/videos" onClick={closeMenu}>Vídeos</Link>
            <Link href="/category/festivais" onClick={closeMenu}>Festivais</Link>
            <Link href="/about" onClick={closeMenu}>Quem Sou</Link>
          </nav>
        </div>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}
    </header>
  );
}
