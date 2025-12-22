/**
 * SQLite Database Adapter
 * 
 * Implements the DatabaseAdapter interface using better-sqlite3 for local development.
 */

import path from 'path';
import type {
    DatabaseAdapter,
    UserAdapter,
    PostAdapter,
    BannerAdapter,
    ActivityAdapter,
    User,
    Post,
    Banner,
    Activity,
    CreatePostInput,
    UpdatePostInput,
    CreateBannerInput,
    UpdateBannerInput,
    CreateActivityInput,
    UpdateActivityInput,
} from '../database.types';

// Conditional import to avoid loading in production
let Database: any;
try {
    Database = require('better-sqlite3');
} catch (e) {
    // better-sqlite3 not available (e.g., in Vercel)
    console.warn('[SQLite] better-sqlite3 not available in this environment');
}

export class SQLiteAdapter implements DatabaseAdapter {
    private db: any;

    public users: UserAdapter;
    public posts: PostAdapter;
    public banners: BannerAdapter;
    public activities: ActivityAdapter;

    constructor(dbPath?: string) {
        if (!Database) {
            throw new Error(
                'SQLite is not available in this environment. Please use DATABASE_TYPE=supabase instead.'
            );
        }

        const finalPath = dbPath || path.join(process.cwd(), 'cinema.db');
        this.db = new Database(finalPath);

        // Initialize adapters
        this.users = new SQLiteUserAdapter(this.db);
        this.posts = new SQLitePostAdapter(this.db);
        this.banners = new SQLiteBannerAdapter(this.db);
        this.activities = new SQLiteActivityAdapter(this.db);
    }

    async initialize(): Promise<void> {
        // Create tables
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        category TEXT NOT NULL,
        content_type TEXT DEFAULT 'post',
        video_url TEXT,
        media_files TEXT,
        rating INTEGER DEFAULT 0,
        published BOOLEAN DEFAULT 0,
        list_items TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image_url TEXT,
        video_url TEXT,
        link TEXT,
        active BOOLEAN DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        image_url TEXT,
        video_url TEXT,
        link TEXT,
        active BOOLEAN DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Run migrations (add columns if they don't exist)
        this.runMigrations();
    }

    private runMigrations(): void {
        const migrations = [
            'ALTER TABLE posts ADD COLUMN rating INTEGER DEFAULT 0',
            'ALTER TABLE posts ADD COLUMN content_type TEXT DEFAULT "post"',
            'ALTER TABLE posts ADD COLUMN video_url TEXT',
            'ALTER TABLE posts ADD COLUMN media_files TEXT',
            'ALTER TABLE posts ADD COLUMN list_items TEXT',
            'ALTER TABLE banners ADD COLUMN video_url TEXT',
            'ALTER TABLE activities ADD COLUMN video_url TEXT',
        ];

        for (const migration of migrations) {
            try {
                this.db.exec(migration);
            } catch (error) {
                // Column likely already exists, ignore error
            }
        }
    }

    async close(): Promise<void> {
        this.db.close();
    }
}

// ==================== User Adapter ====================

class SQLiteUserAdapter implements UserAdapter {
    constructor(private db: any) { }

    async findByUsername(username: string): Promise<User | null> {
        const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username) as User | undefined;
        return user || null;
    }

    async create(username: string, passwordHash: string): Promise<User> {
        const stmt = this.db.prepare(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)'
        );
        const info = stmt.run(username, passwordHash);

        const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid) as User;
        return user;
    }

    async getAll(): Promise<User[]> {
        const stmt = this.db.prepare('SELECT * FROM users');
        return stmt.all() as User[];
    }
}

// ==================== Post Adapter ====================

class SQLitePostAdapter implements PostAdapter {
    constructor(private db: any) { }

    async getAll(): Promise<Post[]> {
        const stmt = this.db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
        return stmt.all() as Post[];
    }

    async getPublished(): Promise<Post[]> {
        const stmt = this.db.prepare(
            'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC'
        );
        return stmt.all() as Post[];
    }

    async getBySlug(slug: string): Promise<Post | null> {
        const stmt = this.db.prepare('SELECT * FROM posts WHERE slug = ?');
        const post = stmt.get(slug) as Post | undefined;
        return post || null;
    }

    async getById(id: number): Promise<Post | null> {
        const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
        const post = stmt.get(id) as Post | undefined;
        return post || null;
    }

    async getByCategory(category: string): Promise<Post[]> {
        const stmt = this.db.prepare(
            'SELECT * FROM posts WHERE category = ? AND published = 1 ORDER BY created_at DESC'
        );
        return stmt.all(category) as Post[];
    }

    async search(query: string): Promise<Post[]> {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const searchTerm = `%${query.trim()}%`;
        const stmt = this.db.prepare(`
            SELECT * FROM posts 
            WHERE published = 1 
            AND (
                title LIKE ? 
                OR excerpt LIKE ? 
                OR content LIKE ? 
                OR category LIKE ?
            )
            ORDER BY created_at DESC
        `);

        return stmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as Post[];
    }


    async create(post: CreatePostInput): Promise<Post> {
        const stmt = this.db.prepare(`
      INSERT INTO posts (
        title, slug, content, excerpt, cover_image, category, 
        content_type, video_url, media_files, rating, published, list_items
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            post.title,
            post.slug,
            post.content,
            post.excerpt || null,
            post.cover_image || null,
            post.category,
            post.content_type || 'post',
            post.video_url || null,
            post.media_files || null,
            post.rating || 0,
            post.published ? 1 : 0,
            post.list_items || null
        );

        const created = this.db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid) as Post;
        return created;
    }

    async update(id: number, post: UpdatePostInput): Promise<Post> {
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(post).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                // Convert boolean to 0/1 for SQLite
                if (key === 'published') {
                    values.push(value ? 1 : 0);
                } else {
                    values.push(value);
                }
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const stmt = this.db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`);
        stmt.run(...values);

        const updated = this.db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
        return updated;
    }

    async delete(id: number): Promise<void> {
        const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
        stmt.run(id);
    }
}

// ==================== Banner Adapter ====================

class SQLiteBannerAdapter implements BannerAdapter {
    constructor(private db: any) { }

    async getAll(): Promise<Banner[]> {
        const stmt = this.db.prepare('SELECT * FROM banners ORDER BY display_order ASC');
        return stmt.all() as Banner[];
    }

    async getActive(): Promise<Banner[]> {
        const stmt = this.db.prepare(
            'SELECT * FROM banners WHERE active = 1 ORDER BY display_order ASC'
        );
        return stmt.all() as Banner[];
    }

    async getById(id: number): Promise<Banner | null> {
        const stmt = this.db.prepare('SELECT * FROM banners WHERE id = ?');
        const banner = stmt.get(id) as Banner | undefined;
        return banner || null;
    }

    async create(banner: CreateBannerInput): Promise<Banner> {
        const stmt = this.db.prepare(`
      INSERT INTO banners (title, image_url, video_url, link, active, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            banner.title || null,
            banner.image_url || null,
            banner.video_url || null,
            banner.link || null,
            banner.active !== undefined ? (banner.active ? 1 : 0) : 1,
            banner.display_order || 0
        );

        const created = this.db.prepare('SELECT * FROM banners WHERE id = ?').get(info.lastInsertRowid) as Banner;
        return created;
    }

    async update(id: number, banner: UpdateBannerInput): Promise<Banner> {
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(banner).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'active') {
                    values.push(value ? 1 : 0);
                } else {
                    values.push(value);
                }
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const stmt = this.db.prepare(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`);
        stmt.run(...values);

        const updated = this.db.prepare('SELECT * FROM banners WHERE id = ?').get(id) as Banner;
        return updated;
    }

    async delete(id: number): Promise<void> {
        const stmt = this.db.prepare('DELETE FROM banners WHERE id = ?');
        stmt.run(id);
    }
}

// ==================== Activity Adapter ====================

class SQLiteActivityAdapter implements ActivityAdapter {
    constructor(private db: any) { }

    async getAll(): Promise<Activity[]> {
        const stmt = this.db.prepare('SELECT * FROM activities ORDER BY display_order ASC');
        return stmt.all() as Activity[];
    }

    async getActive(): Promise<Activity[]> {
        const stmt = this.db.prepare(
            'SELECT * FROM activities WHERE active = 1 ORDER BY display_order ASC'
        );
        return stmt.all() as Activity[];
    }

    async getById(id: number): Promise<Activity | null> {
        const stmt = this.db.prepare('SELECT * FROM activities WHERE id = ?');
        const activity = stmt.get(id) as Activity | undefined;
        return activity || null;
    }

    async create(activity: CreateActivityInput): Promise<Activity> {
        const stmt = this.db.prepare(`
      INSERT INTO activities (title, description, image_url, video_url, link, active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            activity.title || null,
            activity.description || null,
            activity.image_url || null,
            activity.video_url || null,
            activity.link || null,
            activity.active !== undefined ? (activity.active ? 1 : 0) : 1,
            activity.display_order || 0
        );

        const created = this.db.prepare('SELECT * FROM activities WHERE id = ?').get(info.lastInsertRowid) as Activity;
        return created;
    }

    async update(id: number, activity: UpdateActivityInput): Promise<Activity> {
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(activity).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'active') {
                    values.push(value ? 1 : 0);
                } else {
                    values.push(value);
                }
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const stmt = this.db.prepare(`UPDATE activities SET ${fields.join(', ')} WHERE id = ?`);
        stmt.run(...values);

        const updated = this.db.prepare('SELECT * FROM activities WHERE id = ?').get(id) as Activity;
        return updated;
    }

    async delete(id: number): Promise<void> {
        const stmt = this.db.prepare('DELETE FROM activities WHERE id = ?');
        stmt.run(id);
    }
}
