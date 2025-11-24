import db from '@/lib/db';
import { notFound } from 'next/navigation';
import styles from '../post.module.css';
import StarRating from '@/components/StarRating';

// Force dynamic rendering to show updated posts immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPost(slug: string) {
    const stmt = db.prepare('SELECT * FROM posts WHERE slug = ? AND published = 1');
    return stmt.get(slug) as any;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <span className={styles.category}>{post.category}</span>
                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.meta}>
                    <time>{new Date(post.created_at).toLocaleDateString()}</time>
                    {post.rating > 0 && (
                        <div style={{ marginLeft: '15px' }}>
                            <StarRating value={post.rating} readOnly size="medium" />
                        </div>
                    )}
                </div>
            </header>

            {post.cover_image && (
                <div className={styles.coverImage}>
                    <img src={post.cover_image} alt={post.title} />
                </div>
            )}

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}
