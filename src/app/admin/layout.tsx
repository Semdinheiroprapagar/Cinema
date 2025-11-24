'use client';

import AdminNav from '@/components/AdminNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './admin-layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <AdminNav />
            <main className={styles.main}>
                <div className={styles.container}>
                    <Breadcrumbs />
                    {children}
                </div>
            </main>
        </div>
    );
}
