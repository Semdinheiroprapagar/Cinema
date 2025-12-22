/**
 * Database Type Definitions and Adapter Interface
 * 
 * This file defines the common interface that both SQLite and Supabase adapters must implement.
 * This allows the application to work with either database seamlessly.
 */

// ==================== Data Models ====================

export interface User {
    id: number;
    username: string;
    password_hash: string;
    created_at?: string | Date;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    cover_image?: string | null;
    category: string;
    content_type?: string;
    video_url?: string | null;
    media_files?: string | null;
    rating?: number;
    published?: boolean;
    list_items?: string | null;
    created_at?: string | Date;
}

export interface Banner {
    id: number;
    title?: string | null;
    image_url?: string | null;
    video_url?: string | null;
    link?: string | null;
    active?: boolean;
    display_order?: number;
    created_at?: string | Date;
}

export interface Activity {
    id: number;
    title?: string | null;
    description?: string | null;
    image_url?: string | null;
    video_url?: string | null;
    link?: string | null;
    active?: boolean;
    display_order?: number;
    created_at?: string | Date;
}

// ==================== Input Types ====================

export interface CreatePostInput {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    category: string;
    content_type?: string;
    video_url?: string;
    media_files?: string;
    rating?: number;
    published?: boolean;
    list_items?: string;
}

export interface UpdatePostInput {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    category?: string;
    content_type?: string;
    video_url?: string;
    media_files?: string;
    rating?: number;
    published?: boolean;
    list_items?: string;
}

export interface CreateBannerInput {
    title?: string;
    image_url?: string;
    video_url?: string;
    link?: string;
    active?: boolean;
    display_order?: number;
}

export interface UpdateBannerInput {
    title?: string;
    image_url?: string;
    video_url?: string;
    link?: string;
    active?: boolean;
    display_order?: number;
}

export interface CreateActivityInput {
    title?: string;
    description?: string;
    image_url?: string;
    video_url?: string;
    link?: string;
    active?: boolean;
    display_order?: number;
}

export interface UpdateActivityInput {
    title?: string;
    description?: string;
    image_url?: string;
    video_url?: string;
    link?: string;
    active?: boolean;
    display_order?: number;
}

// ==================== Adapter Interfaces ====================

export interface UserAdapter {
    findByUsername(username: string): Promise<User | null>;
    create(username: string, passwordHash: string): Promise<User>;
    getAll(): Promise<User[]>;
}

export interface PostAdapter {
    getAll(): Promise<Post[]>;
    getPublished(): Promise<Post[]>;
    getBySlug(slug: string): Promise<Post | null>;
    getById(id: number): Promise<Post | null>;
    getByCategory(category: string): Promise<Post[]>;
    search(query: string): Promise<Post[]>;
    create(post: CreatePostInput): Promise<Post>;
    update(id: number, post: UpdatePostInput): Promise<Post>;
    delete(id: number): Promise<void>;
}

export interface BannerAdapter {
    getAll(): Promise<Banner[]>;
    getActive(): Promise<Banner[]>;
    getById(id: number): Promise<Banner | null>;
    create(banner: CreateBannerInput): Promise<Banner>;
    update(id: number, banner: UpdateBannerInput): Promise<Banner>;
    delete(id: number): Promise<void>;
}

export interface ActivityAdapter {
    getAll(): Promise<Activity[]>;
    getActive(): Promise<Activity[]>;
    getById(id: number): Promise<Activity | null>;
    create(activity: CreateActivityInput): Promise<Activity>;
    update(id: number, activity: UpdateActivityInput): Promise<Activity>;
    delete(id: number): Promise<void>;
}

/**
 * Main Database Adapter Interface
 * All database implementations must implement this interface
 */
export interface DatabaseAdapter {
    users: UserAdapter;
    posts: PostAdapter;
    banners: BannerAdapter;
    activities: ActivityAdapter;

    /**
     * Initialize the database (create tables, run migrations, etc.)
     */
    initialize(): Promise<void>;

    /**
     * Close database connections (if applicable)
     */
    close?(): Promise<void>;
}

/**
 * Database type configuration
 */
export type DatabaseType = 'sqlite' | 'supabase';
