'use client';

import { useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                className={styles.video}
                src={src}
                poster={poster}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            {!isPlaying && (
                <div className={styles.overlay} onClick={togglePlay}>
                    <div className={styles.playButton}>
                        ▶
                    </div>
                </div>
            )}
        </div>
    );
}
