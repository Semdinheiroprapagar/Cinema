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

    // Ensure the image URL is absolute
    let ogImage = `${baseUrl}/opengraph-image.jpg`; // Default fallback

    if (post.cover_image) {
        // If cover_image is already an absolute URL (starts with http:// or https://), use it as-is
        if (post.cover_image.startsWith('http://') || post.cover_image.startsWith('https://')) {
            ogImage = post.cover_image;
        } else {
            // If it's a relative path, prepend the base URL
            ogImage = `${baseUrl}${post.cover_image.startsWith('/') ? '' : '/'}${post.cover_image}`;
        }
    }

    const postUrl = `${baseUrl}/post/${slug}`;
    const description = post.excerpt || 'Críticas, listas, vídeos e entrevistas de cinema e séries.';

    return {
        title: post.title,
        description: description,
        // Canonical URL
        alternates: {
            canonical: postUrl,
        },
        // Open Graph metadata (Facebook, WhatsApp, LinkedIn)
        openGraph: {
            title: post.title,
            description: description,
            type: 'article',
            locale: 'pt_BR',
            siteName: 'Fragmentos do Cinema',
            url: postUrl,
            publishedTime: post.created_at || undefined,
            authors: ['Fragmentos do Cinema'],
            section: post.category || undefined,
            images: [
                {
                    url: ogImage,
                    secureUrl: ogImage.startsWith('https://') ? ogImage : undefined,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                    type: 'image/jpeg',
                },
            ],
        },
        // Twitter Card metadata
        twitter: {
            card: 'summary_large_image',
            site: '@fragmentoscinema',
            creator: '@fragmentoscinema',
            title: post.title,
            description: description,
            images: {
                url: ogImage,
                alt: post.title,
            },
        },
        // Additional metadata for better SEO
        robots: {
            index: post.published ? true : false,
            follow: true,
            googleBot: {
                index: post.published ? true : false,
                follow: true,
            },
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
