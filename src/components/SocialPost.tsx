'use client';

import Image from 'next/image';
import styles from './SocialPost.module.css';

interface SocialPostProps {
    post: {
        title: string;
        content: string;
        cover_image: string;
        created_at: string;
        category: string;
    };
}

export default function SocialPost({ post }: SocialPostProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>MA</div>
                <div className={styles.meta}>
                    <span className={styles.author}>Meio Amargo</span>
                    <span className={styles.date}>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className={styles.imageContainer}>
                {post.cover_image && (
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className={styles.image}
                    />
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>❤️</button>
                    <button className={styles.actionBtn}>💬</button>
                    <button className={styles.actionBtn}>✈️</button>
                </div>

                <h3 className={styles.title}>{post.title}</h3>
                <div className={styles.caption} dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
}
