'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Carousel.module.css';

interface Post {
    id: number;
    slug: string;
    title: string;
    cover_image: string;
    excerpt: string;
}

interface CarouselProps {
    posts: Post[];
}

export default function Carousel({ posts }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (posts.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [posts.length]);

    if (posts.length === 0) return null;

    return (
        <div className={styles.carousel}>
            {posts.map((post, index) => (
                <div
                    key={post.id}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${post.cover_image})` }}
                >
                    <div className={styles.content}>
                        <h2>{post.title}</h2>
                        <p>{post.excerpt}</p>
                        <Link href={`/post/${post.slug}`} className={styles.button}>
                            Leia Mais
                        </Link>
                    </div>
                </div>
            ))}
            <div className={styles.dots}>
                {posts.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}
