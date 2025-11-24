import Link from 'next/link';
import styles from './PostCard.module.css';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string;
    category: string;
    created_at: string;
}

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className={styles.card}>
            <Link href={`/post/${post.slug}`} className={styles.imageLink}>
                {post.cover_image ? (
                    <div className={styles.image} style={{ backgroundImage: `url(${post.cover_image})` }} />
                ) : (
                    <div className={styles.placeholder} />
                )}
            </Link>
            <div className={styles.content}>
                <span className={styles.category}>{post.category}</span>
                <Link href={`/post/${post.slug}`}>
                    <h2 className={styles.title}>{post.title}</h2>
                </Link>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <time className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</time>
            </div>
        </article>
    );
}
