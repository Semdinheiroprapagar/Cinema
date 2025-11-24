import db from '@/lib/db';
import Link from 'next/link';
import styles from './home.module.css';
import PostCard from '@/components/PostCard';

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
      {heroPost && (
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.category}>{heroPost.category}</span>
            <Link href={`/post/${heroPost.slug}`}>
              <h1 className={styles.heroTitle}>{heroPost.title}</h1>
            </Link>
            <p className={styles.heroExcerpt}>{heroPost.excerpt}</p>
            <Link href={`/post/${heroPost.slug}`} className={styles.readMore}>
              Ler Mais
            </Link>
          </div>
          {heroPost.cover_image && (
            <div className={styles.heroImage} style={{ backgroundImage: `url(${heroPost.cover_image})` }} />
          )}
        </section>
      )}

      <section className={styles.grid}>
        {otherPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
