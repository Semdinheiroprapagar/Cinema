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
                <div className={styles.imageContainer}>
                    <Image
                        src="/uploads/perfil.png"
                        alt="Murilo Abrahão de Paula"
                        width={400}
                        height={600}
                        className={styles.profileImage}
                        priority
                        unoptimized
                    />
                </div>
                <div className={styles.text}>
                    <p>
                        Olá! Sou Murilo Abrahão de Paula, nascido na encantadora Franca, interior de São Paulo. Embora minha profissão seja a de Cirurgião-Dentista, é no cinema que encontro minha verdadeira paixão. Minha relação com essa arte começou ainda na infância, quando eu assistia incansavelmente aos clássicos da Disney em fitas VHS — sementes que germinaram numa admiração profunda pela linguagem cinematográfica.
                    </p>
                    <p>
                        Com o passar dos anos, fui buscando me aperfeiçoar, participando de cursos com alguns dos nomes mais importantes do pensamento crítico brasileiro, como Pablo Villaça, Fábio Rockenbach, Arthur Tuoto, Inácio Araújo e Philippe Leão. Cada um deles ampliou meu olhar e me permitiu mergulhar em diferentes perspectivas e camadas dessa arte fascinante.
                    </p>
                    <p>
                        Se você também é apaixonado por cinema, te convido a me acompanhar no Instagram, onde compartilho reflexões, análises e fragmentos do audiovisual em @fragmentosdocinema. Você também pode explorar minhas listas e críticas no Letterboxd, onde estou como muriloabrahao.
                    </p>
                    <p>
                        Vamos juntos explorar o cinema e celebrar tudo aquilo que ele desperta em nós — emoção, pensamento, memória e transformação.
                    </p>
                </div>
            </div>
        </div>
    );
}
