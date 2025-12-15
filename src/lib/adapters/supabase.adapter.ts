/**
 * Supabase Database Adapter
 * 
 * Implements the DatabaseAdapter interface using Supabase (PostgreSQL) for production.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseAdapter implements DatabaseAdapter {
    private supabase: SupabaseClient;

    public users: UserAdapter;
    public posts: PostAdapter;
    public banners: BannerAdapter;
    public activities: ActivityAdapter;

    constructor() {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            const missing = [];
            if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
            if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

            throw new Error(
                `Missing Supabase credentials: ${missing.join(', ')}. ` +
                `Please configure these environment variables in your deployment platform (Vercel/etc). ` +
                `See VERCEL_ENV_SETUP.md for instructions.`
            );
        }

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Initialize adapters
        this.users = new SupabaseUserAdapter(this.supabase);
        this.posts = new SupabasePostAdapter(this.supabase);
        this.banners = new SupabaseBannerAdapter(this.supabase);
        this.activities = new SupabaseActivityAdapter(this.supabase);
    }

    async initialize(): Promise<void> {
        // Supabase tables should be created via SQL scripts or migrations
        // This method can be used to verify connection or run any setup logic
        try {
            const { error } = await this.supabase.from('users').select('count').limit(1);
            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned, which is fine
                console.warn('Supabase connection warning:', error.message);
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            throw error;
        }
    }
}

// ==================== Helper Functions ====================

function toArray<T>(data: T[] | null): T[] {
    return data || [];
}

// ==================== User Adapter ====================

class SupabaseUserAdapter implements UserAdapter {
    constructor(private supabase: SupabaseClient) { }

    async findByUsername(username: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data as User;
    }

    async create(username: string, passwordHash: string): Promise<User> {
        const { data, error } = await this.supabase
            .from('users')
            .insert({ username, password_hash: passwordHash })
            .select()
            .single();

        if (error) throw error;
        return data as User;
    }

    async getAll(): Promise<User[]> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*');

        if (error) throw error;
        return toArray(data) as User[];
    }
}

// ==================== Post Adapter ====================

class SupabasePostAdapter implements PostAdapter {
    constructor(private supabase: SupabaseClient) { }

    async getAll(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return toArray(data) as Post[];
    }

    async getPublished(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return toArray(data) as Post[];
    }

    async getBySlug(slug: string): Promise<Post | null> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data as Post;
    }

    async getById(id: number): Promise<Post | null> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data as Post;
    }

    async getByCategory(category: string): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .eq('category', category)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return toArray(data) as Post[];
    }

    async create(post: CreatePostInput): Promise<Post> {
        const { data, error } = await this.supabase
            .from('posts')
            .insert({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt || null,
                cover_image: post.cover_image || null,
                category: post.category,
                content_type: post.content_type || 'post',
                video_url: post.video_url || null,
                media_files: post.media_files || null,
                rating: post.rating || 0,
                published: post.published || false,
                list_items: post.list_items || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Post;
    }

    async update(id: number, post: UpdatePostInput): Promise<Post> {
        const updateData: any = {};

        Object.entries(post).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }

        const { data, error } = await this.supabase
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Post;
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

// ==================== Banner Adapter ====================

class SupabaseBannerAdapter implements BannerAdapter {
    constructor(private supabase: SupabaseClient) { }

    async getAll(): Promise<Banner[]> {
        const { data, error } = await this.supabase
            .from('banners')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return toArray(data) as Banner[];
    }

    async getActive(): Promise<Banner[]> {
        const { data, error } = await this.supabase
            .from('banners')
            .select('*')
            .eq('active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return toArray(data) as Banner[];
    }

    async getById(id: number): Promise<Banner | null> {
        const { data, error } = await this.supabase
            .from('banners')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data as Banner;
    }

    async create(banner: CreateBannerInput): Promise<Banner> {
        const { data, error } = await this.supabase
            .from('banners')
            .insert({
                title: banner.title || null,
                image_url: banner.image_url || null,
                video_url: banner.video_url || null,
                link: banner.link || null,
                active: banner.active !== undefined ? banner.active : true,
                display_order: banner.display_order || 0,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Banner;
    }

    async update(id: number, banner: UpdateBannerInput): Promise<Banner> {
        const updateData: any = {};

        Object.entries(banner).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }

        const { data, error } = await this.supabase
            .from('banners')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Banner;
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('banners')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

// ==================== Activity Adapter ====================

class SupabaseActivityAdapter implements ActivityAdapter {
    constructor(private supabase: SupabaseClient) { }

    async getAll(): Promise<Activity[]> {
        const { data, error } = await this.supabase
            .from('activities')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return toArray(data) as Activity[];
    }

    async getActive(): Promise<Activity[]> {
        const { data, error } = await this.supabase
            .from('activities')
            .select('*')
            .eq('active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return toArray(data) as Activity[];
    }

    async getById(id: number): Promise<Activity | null> {
        const { data, error } = await this.supabase
            .from('activities')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data as Activity;
    }

    async create(activity: CreateActivityInput): Promise<Activity> {
        const { data, error } = await this.supabase
            .from('activities')
            .insert({
                title: activity.title || null,
                description: activity.description || null,
                image_url: activity.image_url || null,
                video_url: activity.video_url || null,
                link: activity.link || null,
                active: activity.active !== undefined ? activity.active : true,
                display_order: activity.display_order || 0,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Activity;
    }

    async update(id: number, activity: UpdateActivityInput): Promise<Activity> {
        const updateData: any = {};

        Object.entries(activity).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }

        const { data, error } = await this.supabase
            .from('activities')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Activity;
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('activities')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}
