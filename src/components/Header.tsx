'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Header.module.css';
import SearchButton from './SearchButton';
import SearchModal from './SearchModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.mainNav}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image src="/logo.png" alt="Fragmentos do Cinema" width={120} height={60} className={styles.logoImage} />
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
            <Link href="/category/artigos" onClick={closeMenu}>Artigos</Link>
            <Link href="/category/curiosidades" onClick={closeMenu}>Curiosidades</Link>
            <Link href="/about" onClick={closeMenu}>Quem Sou</Link>
          </nav>

          {/* Search Button */}
          <div className={styles.searchButtonWrapper}>
            <SearchButton onClick={openSearch} />
          </div>
        </div>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </header>
  );
}
