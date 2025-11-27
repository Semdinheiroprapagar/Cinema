'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminNav.module.css';

export default function AdminNav() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname?.startsWith(path)) return true;
        return false;
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Link href="/admin" className={styles.logo}>
                        📊 Admin Panel
                    </Link>
                </div>

                <button
                    className={styles.hamburger}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
                    <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
                    <span className={mobileMenuOpen ? styles.hamburgerOpen : ''}></span>
                </button>

                <div className={`${styles.menu} ${mobileMenuOpen ? styles.menuOpen : ''}`}>
                    <Link
                        href="/admin"
                        className={`${styles.link} ${isActive('/admin') ? styles.active : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/posts/new"
                        className={`${styles.link} ${pathname?.includes('/posts/new') ? styles.active : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Novo Post
                    </Link>
                    <Link
                        href="/admin/banners"
                        className={`${styles.link} ${isActive('/admin/banners') ? styles.active : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Banners
                    </Link>
                    <Link
                        href="/admin/activities"
                        className={`${styles.link} ${isActive('/admin/activities') ? styles.active : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Atividades
                    </Link>
                </div>

                <div className={styles.actions}>
                    <Link href="/" className={styles.viewSite}>
                        Ver Site →
                    </Link>
                </div>
            </div>
        </nav>
    );
}
