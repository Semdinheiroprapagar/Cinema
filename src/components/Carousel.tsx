'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Carousel.module.css';

interface Banner {
    id: number;
    title: string;
    image_url: string;
    link: string;
}

export default function Carousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch('/api/banners')
            .then((res) => res.json())
            .then((data) => setBanners(data))
            .catch((err) => console.error('Failed to fetch banners', err));
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    return (
        <div className={styles.carousel}>
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${banner.image_url})` }}
                >
                    <div className={styles.content}>
                        <h2>{banner.title}</h2>
                        {banner.link && (
                            <Link href={banner.link} className={styles.button}>
                                Saiba Mais
                            </Link>
                        )}
                    </div>
                </div>
            ))}
            <div className={styles.dots}>
                {banners.map((_, index) => (
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
