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
  const heroPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className={styles.container}>
      <Carousel />
      <Activities />

      <section className={styles.grid}>
        {otherPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
