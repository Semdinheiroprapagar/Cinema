'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import styles from './SearchResults.module.css';

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    cover_image?: string | null;
    category: string;
    created_at?: string | Date;
    rating?: number;
}

export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchResults() {
            if (!query.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error('Erro ao buscar resultados');
                }

                const data = await response.json();
                setResults(data.results || []);
            } catch (err: any) {
                console.error('Search error:', err);
                setError(err.message || 'Erro ao buscar');
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Buscando...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Erro na busca</h1>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Resultados para: <span className={styles.query}>"{query}"</span>
            </h1>

            {results.length === 0 ? (
                <div className={styles.noResults}>
                    <p>Nenhum resultado encontrado para "{query}"</p>
                    <p className={styles.suggestion}>Tente usar palavras-chave diferentes ou mais genéricas.</p>
                </div>
            ) : (
                <>
                    <p className={styles.count}>
                        {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>
                    <div className={styles.results}>
                        {results.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
