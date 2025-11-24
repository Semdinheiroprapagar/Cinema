'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

interface Post {
    id: number;
    title: string;
    category: string;
    published: number;
    created_at: string;
}

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

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

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const res = await fetch(`/api/admin/posts/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setPosts(posts.filter((p) => p.id !== id));
        } else {
            alert('Failed to delete post');
        }
    }

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <Link href="/admin/posts/new" className={styles.createButton}>
                    New Post
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{post.category}</td>
                                <td>
                                    <span className={post.published ? styles.published : styles.draft}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td className={styles.actions}>
                                    <Link href={`/admin/posts/${post.id}/edit`} className={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.empty}>
                                    No posts found. Create one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
