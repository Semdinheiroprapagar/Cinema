import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata = {
    title: 'Quem Sou | Fragmentos do Cinema',
    description: 'Conheça mais sobre o autor do Fragmentos do Cinema.',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Quem Sou</h1>
            </header>

            <div className={styles.content}>
                <div className={styles.text}>
                    <p>
                        Olá! Sou Murilo Abrahão de Paula, crítico de cinema e criador do Fragmentos do Cinema.
                    </p>
                    <p>
                        Aqui você encontra críticas, listas e reflexões sobre o mundo do cinema e das séries.
                    </p>

                    <div className={styles.downloadSection}>
                        <h3>Mídia Kit</h3>
                        <p>Baixe nosso mídia kit para saber mais sobre parcerias e estatísticas.</p>
                        <a href="/midia-kit.pdf" target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
                            Baixar Mídia Kit (PDF)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
