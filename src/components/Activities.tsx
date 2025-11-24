'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Activities.module.css';

interface Activity {
    id: number;
    title: string;
    description: string;
    image_url: string;
    link: string;
}

export default function Activities() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        fetch('/api/activities')
            .then((res) => res.json())
            .then((data) => setActivities(data))
            .catch((err) => console.error('Failed to fetch activities', err));
    }, []);

    if (activities.length === 0) return null;

    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Outras Atividades</h2>
            <div className={styles.grid}>
                {activities.map((activity) => (
                    <div key={activity.id} className={styles.card}>
                        {activity.image_url && (
                            <div className={styles.image} style={{ backgroundImage: `url(${activity.image_url})` }} />
                        )}
                        <div className={styles.content}>
                            <h3 className={styles.title}>{activity.title}</h3>
                            <p className={styles.description}>{activity.description}</p>
                            {activity.link && (
                                <Link href={activity.link} className={styles.link}>
                                    Saiba Mais
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
