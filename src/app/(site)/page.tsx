import db from '@/lib/db';
import Link from 'next/link';
import styles from './home.module.css';
import PostCard from '@/components/PostCard';
import Carousel from '@/components/Carousel';
import Activities from '@/components/Activities';

// Force dynamic rendering to show new posts immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts() {
  const stmt = db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC');
  return stmt.all() as any[];
}

export default async function Home() {
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
}
