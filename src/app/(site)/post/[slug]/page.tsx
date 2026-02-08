import { db } from '@/lib/database';
import { notFound } from 'next/navigation';
import styles from '../post.module.css';
import StarRating from '@/components/StarRating';

// Force dynamic rendering to show updated posts immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ListItem {
    title: string;
    image_url: string;
    description?: string;
}

async function getPost(slug: string) {
    const post = await db.posts.getBySlug(slug);

    if (!post || !post.published) return null;

    // Parse list_items if it exists
    if (post && post.list_items && typeof post.list_items === 'string') {
        try {
            post.list_items = JSON.parse(post.list_items);
        } catch (e) {
            post.list_items = null;
        }
    }

    return post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Post não encontrado',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const ogImage = post.cover_image || `${baseUrl}/opengraph-image.jpg`;

    return {
        title: post.title,
        description: post.excerpt || 'Fragmentos do Cinema - Cinema e Séries',
        openGraph: {
            title: post.title,
            description: post.excerpt || 'Críticas, listas, vídeos e entrevistas de cinema e séries.',
            type: 'article',
            locale: 'pt_BR',
            siteName: 'Fragmentos do Cinema',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || 'Críticas, listas, vídeos e entrevistas de cinema e séries.',
            images: [ogImage],
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const listItems: ListItem[] = (Array.isArray(post.list_items) ? post.list_items : []) as ListItem[];
    const hasListItems = listItems.length > 0;

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <span className={styles.category}>{post.category}</span>
                <h1 className={styles.title}>{post.title}</h1>
                {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
                <div className={styles.meta}>
                    {post.created_at && <time>{new Date(post.created_at).toLocaleDateString('pt-BR')}</time>}
                    {post.rating && post.rating > 0 && (
                        <div style={{ marginLeft: '15px' }}>
                            <StarRating value={post.rating} readOnly size="medium" />
                        </div>
                    )}
                </div>
            </header>

            {post.cover_image && (
                <div className={styles.coverImage}>
                    <img src={post.cover_image} alt={post.title} />
                </div>
            )}

            {post.content && (
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            )}

            {hasListItems && (
                <div className={styles.listItems}>
                    {listItems.map((item, index) => (
                        <div key={index} className={styles.listItem}>
                            {item.image_url && (
                                <div className={styles.listItemImage}>
                                    <img src={item.image_url} alt={item.title} />
                                </div>
                            )}
                            <h3 className={styles.listItemTitle}>
                                <span className={styles.listItemNumber}>{index + 1}.</span>
                                {item.title}
                            </h3>
                            {item.description && (
                                <div className={styles.listItemDescription}>
                                    {item.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </article>
    );
}
