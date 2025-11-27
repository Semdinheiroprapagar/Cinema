'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';

interface Post {
    id: number;
    slug: string;
    title: string;
    cover_image: string;
    excerpt: string;
    category: string;
    created_at: string;
}

export default function BannersPage() {
    const [bannerPosts, setBannerPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBannerPosts();
    }, []);

    const fetchBannerPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            if (res.ok) {
                const data = await res.json();
                // Get the 3 most recent published posts
                const publishedPosts = data.filter((p: any) => p.published === 1);
                setBannerPosts(publishedPosts.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Banners Ativos (Últimos Posts)</h1>
                    <p className={styles.subtitle}>
                        Os 3 posts mais recentes aparecem automaticamente no carrossel da home
                    </p>
                </div>
            </div>

            <div style={{
                padding: '20px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                marginBottom: '30px'
            }}>
                <p style={{ margin: 0, color: '#0c4a6e' }}>
                    ℹ️ <strong>Sistema Automático:</strong> Os banners são atualizados automaticamente
                    sempre que você publica um novo post. Os 3 posts mais recentes sempre aparecerão no carrossel.
                </p>
            </div>

            {bannerPosts.length === 0 ? (
                <div className={styles.empty}>
                    <p>📝 Nenhum post publicado ainda. Publique posts para vê-los no banner.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {bannerPosts.map((post, index) => (
                        <div key={post.id} style={{
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {post.cover_image ? (
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#9ca3af'
                                }}>
                                    Sem imagem
                                </div>
                            )}
                            <div style={{ padding: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}>
                                    <span className={styles.categoryBadge}>{post.category}</span>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#0ea5e9',
                                        backgroundColor: '#e0f2fe',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        #{index + 1} no Banner
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{post.title}</h3>
                                <p style={{
                                    margin: '0 0 15px 0',
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    lineHeight: '1.5'
                                }}>
                                    {post.excerpt}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <time style={{ fontSize: '12px', color: '#9ca3af' }}>
                                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                    </time>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link
                                            href={`/post/${post.slug}`}
                                            target="_blank"
                                            className={styles.viewBtn}
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '14px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            👁️ Ver
                                        </Link>
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className={styles.editBtn}
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '14px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            ✏️ Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
