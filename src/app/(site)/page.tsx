import { db } from '@/lib/database';
import Link from 'next/link';
import styles from './home.module.css';
import PostCard from '@/components/PostCard';
import Carousel from '@/components/Carousel';
import Activities from '@/components/Activities';

// Force dynamic rendering to show new posts immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts() {
  try {
    console.log('[HomePage] Fetching posts from database...');
    const posts = await db.posts.getPublished();
    console.log(`[HomePage] Successfully fetched ${posts.length} posts`);
    return posts;
  } catch (error: any) {
    console.error('[HomePage] Error fetching posts:', error);
    console.error('[HomePage] Error stack:', error.stack);
    console.error('[HomePage] Error message:', error.message);
    throw error;
  }
}

export default async function Home() {
  try {
    console.log('[HomePage] Starting to render home page...');
    const posts = await getPosts();
    const bannerPosts = posts.slice(0, 3); // First 3 posts for carousel
    const gridPosts = posts.slice(3); // Remaining posts for grid

    return (
      <div className={styles.container}>
        <Carousel posts={bannerPosts} />
        <Activities />

        <section className={styles.grid}>
          {gridPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </div>
    );
  } catch (error: any) {
    console.error('[HomePage] Fatal error rendering page:', error);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Erro ao carregar página</h1>
        <p>Detalhes: {error.message}</p>
        <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
          {error.stack}
        </pre>
      </div>
    );
  }
}
