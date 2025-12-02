'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

interface Post {
    id: number;
    title: string;
    slug: string;
    category: string;
    content_type: string;
    published: number;
    created_at: string;
}

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const res = await fetch('/api/admin/posts');
        if (res.ok) {
            const data = await res.json();
            setPosts(data);
        }
        setLoading(false);
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) return;

        const res = await fetch(`/api/admin/posts/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setPosts(posts.filter((p) => p.id !== id));
        } else {
            alert('Falha ao deletar post');
        }
    }

    const filteredPosts = filter === 'all'
        ? posts
        : posts.filter(p => p.category === filter);

    if (loading) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Todos os Posts</h1>
                    <p className={styles.subtitle}>{posts.length} posts no total</p>
                </div>
                <Link href="/admin/posts/new" className={styles.createButton}>
                    ➕ Novo Post
                </Link>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todos ({posts.length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'Críticas' ? styles.active : ''}`}
                    onClick={() => setFilter('Críticas')}
                >
                    📽️ Críticas ({posts.filter(p => p.category === 'Críticas').length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'Listas' ? styles.active : ''}`}
                    onClick={() => setFilter('Listas')}
                >
                    📋 Listas ({posts.filter(p => p.category === 'Listas').length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'Artigos' ? styles.active : ''}`}
                    onClick={() => setFilter('Artigos')}
                >
                    📝 Artigos ({posts.filter(p => p.category === 'Artigos').length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'Curiosidades' ? styles.active : ''}`}
                    onClick={() => setFilter('Curiosidades')}
                >
                    💡 Curiosidades ({posts.filter(p => p.category === 'Curiosidades').length})
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id}>
                                <td className={styles.titleCell}>
                                    <Link href={`/post/${post.slug}`} target="_blank" className={styles.postTitle}>
                                        {post.title}
                                    </Link>
                                </td>
                                <td>
                                    <span className={styles.categoryBadge}>
                                        {post.category}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.typeBadge}>
                                        {post.content_type === 'video' ? '🎥 Vídeo' :
                                            post.content_type === 'social' ? '📱 Social' : '📄 Post'}
                                    </span>
                                </td>
                                <td>
                                    <span className={post.published ? styles.published : styles.draft}>
                                        {post.published ? '✓ Publicado' : '○ Rascunho'}
                                    </span>
                                </td>
                                <td className={styles.dateCell}>
                                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className={styles.actionsCell}>
                                    <Link href={`/admin/posts/${post.id}/edit`} className={styles.editBtn}>
                                        ✏️ Editar
                                    </Link>
                                    <button onClick={() => handleDelete(post.id, post.title)} className={styles.deleteBtn}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPosts.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.empty}>
                                    {filter === 'all'
                                        ? '📝 Nenhum post encontrado. Crie o primeiro!'
                                        : `Nenhum post na categoria ${filter}`
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
