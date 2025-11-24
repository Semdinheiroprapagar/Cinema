'use client';

import { useState } from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export default function StarRating({ value, onChange, readOnly = false, size = 'medium' }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (rating: number) => {
        if (!readOnly && onChange) {
            onChange(rating);
        }
    };

    const handleMouseEnter = (rating: number) => {
        if (!readOnly) {
            setHoverRating(rating);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || value;

    return (
        <div className={`${styles.container} ${styles[size]} ${readOnly ? styles.readOnly : styles.interactive}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${styles.star} ${star <= displayRating ? styles.filled : styles.empty}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    disabled={readOnly}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                    ★
                </button>
            ))}
            {!readOnly && (
                <span className={styles.label}>
                    {value > 0 ? `${value}/5` : 'Sem avaliação'}
                </span>
            )}
        </div>
    );
}
