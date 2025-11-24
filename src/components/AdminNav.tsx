'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminNav.module.css';

export default function AdminNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Link href="/admin" className={styles.logo}>
                        📊 Admin Panel
                    </Link>
                </div>

                <div className={styles.menu}>
                    <Link
                        href="/admin"
                        className={`${styles.link} ${isActive('/admin') ? styles.active : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/posts/new"
                        className={`${styles.link} ${pathname?.includes('/posts/new') ? styles.active : ''}`}
                    >
                        Novo Post
                    </Link>
                    <Link
                        href="/admin/banners"
                        className={`${styles.link} ${isActive('/admin/banners') ? styles.active : ''}`}
                    >
                        Banners
                    </Link>
                    <Link
                        href="/admin/activities"
                        className={`${styles.link} ${isActive('/admin/activities') ? styles.active : ''}`}
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
