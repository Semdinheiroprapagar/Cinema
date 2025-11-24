import Link from 'next/link';
import styles from './PostCard.module.css';
import StarRating from './StarRating';
import SocialPost from './SocialPost';
import VideoPlayer from './VideoPlayer';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string;
    category: string;
    created_at: string;
    rating?: number;
    content_type?: string;
    video_url?: string;
}

export default function PostCard({ post }: { post: Post }) {
    if (post.content_type === 'social') {
        return <SocialPost post={post} />;
    }

    if (post.content_type === 'video' && post.video_url) {
        return (
            <article className={styles.card}>
                <div className={styles.videoContainer}>
                    <VideoPlayer src={post.video_url} poster={post.cover_image} />
                </div>
                <div className={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.category}>{post.category}</span>
                    </div>
                    <Link href={`/post/${post.slug}`}>
                        <h2 className={styles.title}>{post.title}</h2>
                    </Link>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <time className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</time>
                </div>
            </article>
        );
    }

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.category}>{post.category}</span>
                    {post.rating !== undefined && post.rating > 0 && (
                        <StarRating value={post.rating} readOnly size="small" />
                    )}
                </div>
                <Link href={`/post/${post.slug}`}>
                    <h2 className={styles.title}>{post.title}</h2>
                </Link>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <time className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</time>
            </div>
        </article>
    );
}

