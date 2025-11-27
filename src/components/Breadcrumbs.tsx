'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
    const pathname = usePathname();

    if (!pathname || pathname === '/admin') return null;

    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        let label = segment;

        // Customize labels
        if (segment === 'admin') label = 'Admin';
        else if (segment === 'posts') label = 'Posts';
        else if (segment === 'new') label = 'Novo';
        else if (segment === 'edit') label = 'Editar';
        else if (segment === 'banners') label = 'Banners';
        else if (segment === 'activities') label = 'Atividades';
        else if (segment === 'criticas') label = 'Críticas';
        else if (segment === 'listas') label = 'Listas';
        else if (segment === 'artigos') label = 'Listas'; // Backward compatibility
        else if (segment === 'videos') label = 'Vídeos';
        else if (segment === 'festivais') label = 'Festivais';
        else if (segment === 'curiosidades') label = 'Curiosidades';
        else if (segment === 'temas') label = 'Curiosidades'; // Backward compatibility
        else if (!isNaN(Number(segment))) label = `#${segment}`;

        return { path, label };
    });

    return (
        <nav className={styles.breadcrumbs}>
            <Link href="/admin" className={styles.home}>
                🏠 Dashboard
            </Link>
            {breadcrumbs.slice(1).map((crumb, index) => (
                <span key={crumb.path} className={styles.item}>
                    <span className={styles.separator}>/</span>
                    {index === breadcrumbs.length - 2 ? (
                        <span className={styles.current}>{crumb.label}</span>
                    ) : (
                        <Link href={crumb.path} className={styles.link}>
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
