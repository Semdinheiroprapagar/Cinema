'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../app/admin/admin.module.css';
import StarRating from './StarRating';
import ImageUpload from './ImageUpload';

interface PostFormProps {
    initialData?: {
        title: string;
        content: string;
        excerpt: string;
        cover_image: string;
        category: string;
        content_type: string;
        video_url: string;
        rating: number;
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
            content_type: 'post',
            video_url: '',
            rating: 0,
            published: false,
        }
    );
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) || 0 : value,
        }));
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
                    <label htmlFor="content_type">Content Type</label>
                    <select
                        id="content_type"
                        name="content_type"
                        value={formData.content_type}
                        onChange={handleChange}
                    >
                        <option value="post">Standard Post</option>
                        <option value="video">Video</option>
                        <option value="social">Social Post</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="rating">Avaliação</label>
                    <StarRating
                        value={formData.rating}
                        onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                    />
                </div>

                <ImageUpload
                    value={formData.cover_image}
                    onChange={(url) => setFormData((prev) => ({ ...prev, cover_image: url }))}
                    label="Cover Image"
                />

                {formData.content_type === 'video' && (
                    <div className={styles.field}>
                        <label>Video File</label>
                        <ImageUpload
                            value={formData.video_url}
                            onChange={(url) => setFormData((prev) => ({ ...prev, video_url: url }))}
                            label="Upload Video"
                            accept="video/*"
                        />
                        <p className={styles.helpText}>Supported formats: MP4, WebM (Max 100MB)</p>
                    </div>
                )}

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
