'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../app/admin/admin.module.css';

interface PostFormProps {
    initialData?: {
        title: string;
        content: string;
        excerpt: string;
        cover_image: string;
        category: string;
        published: boolean;
    };
    onSubmit: (data: any) => Promise<void>;
    isEditing?: boolean;
}

export default function PostForm({ initialData, onSubmit, isEditing }: PostFormProps) {
    const [formData, setFormData] = useState(
        initialData || {
            title: '',
            content: '',
            excerpt: '',
            cover_image: '',
            category: 'Críticas',
            published: false,
        }
    );
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Críticas">Críticas</option>
                        <option value="Artigos">Artigos</option>
                        <option value="Vídeos">Vídeos</option>
                        <option value="Festivais">Festivais</option>
                        <option value="Temas">Temas</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="cover_image">Cover Image URL</label>
                    <input
                        type="url"
                        id="cover_image"
                        name="cover_image"
                        value={formData.cover_image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="excerpt">Excerpt</label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="content">Content (HTML/Markdown)</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={15}
                    />
                </div>

                <div className={`${styles.field} ${styles.checkbox}`}>
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="published" style={{ marginBottom: 0 }}>Published</label>
                </div>

                <div className={styles.formActions}>
                    <Link href="/admin" className={styles.cancelBtn}>
                        Cancel
                    </Link>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
