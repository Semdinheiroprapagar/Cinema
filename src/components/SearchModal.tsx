'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchModal.module.css';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
            setQuery('');
        }
    };

    const handleClose = () => {
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Buscar</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Fechar busca"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <div className={styles.inputWrapper}>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Digite o nome do filme, série ou artigo..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                    </div>
                </form>

                {!query && (
                    <div className={styles.emptyState}>
                        <p>Digite para buscar...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
