import { notFound } from 'next/navigation';
import db from '@/lib/db';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

// Force dynamic rendering and revalidate every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getPostsByCategory(categorySlug: string) {
    // Map slug to category name (e.g., 'criticas' -> 'Críticas')
    const categoryMap: Record<string, string> = {
        'criticas': 'Críticas',
        'listas': 'Listas',
        'artigos': 'Listas', // Backward compatibility
        'videos': 'Vídeos',
        'festivais': 'Festivais',
        'curiosidades': 'Curiosidades',
        'temas': 'Curiosidades' // Backward compatibility
    };

    const categoryName = categoryMap[categorySlug.toLowerCase()];
    if (!categoryName) return null;

    const stmt = db.prepare('SELECT * FROM posts WHERE category = ? AND published = 1 ORDER BY created_at DESC');
    return {
        name: categoryName,
        posts: stmt.all(categoryName)
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const data = await getPostsByCategory(slug);

    if (!data) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{data.name}</h1>
                <p className={styles.subtitle}>
                    {data.posts.length === 0
                        ? 'Nenhum post publicado ainda nesta categoria.'
                        : `${data.posts.length} ${data.posts.length === 1 ? 'post' : 'posts'}`
                    }
                </p>
            </header>

            {data.posts.length > 0 ? (
                <div className={styles.grid}>
                    {data.posts.map((post: any) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <p>📝 Em breve teremos conteúdo incrível aqui!</p>
                </div>
            )}
        </div>
    );
}
