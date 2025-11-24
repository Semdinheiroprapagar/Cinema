/**
 * Database wrapper para Supabase
 * 
 * Este arquivo substitui o better-sqlite3 por Supabase (PostgreSQL)
 * Mantém a mesma interface para minimizar mudanças no código
 */

import { supabaseAdmin } from './supabase';

// Helper para converter resultados do Supabase para o formato esperado
function toArray<T>(data: T[] | null): T[] {
    return data || [];
}

// Users
export const users = {
    async findByUsername(username: string) {
        const { data } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        return data;
    },

    async create(username: string, passwordHash: string) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert({ username, password_hash: passwordHash })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAll() {
        const { data } = await supabaseAdmin
            .from('users')
            .select('*');
        return toArray(data);
    }
};

// Posts
export const posts = {
    async getAll() {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        return toArray(data);
    },

    async getPublished() {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
        return toArray(data);
    },

    async getBySlug(slug: string) {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();
        return data;
    },

    async getById(id: number) {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
        return data;
    },

    async getByCategory(category: string) {
        const { data } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('category', category)
            .eq('published', true)
            .order('created_at', { ascending: false });
        return toArray(data);
    },

    async create(post: {
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
    }) {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert(post)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: number, post: {
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
    }) {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .update(post)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Banners
export const banners = {
    async getAll() {
        const { data } = await supabaseAdmin
            .from('banners')
            .select('*')
            .order('display_order', { ascending: true });
        return toArray(data);
    },

    async getActive() {
        const { data } = await supabaseAdmin
            .from('banners')
            .select('*')
            .eq('active', true)
            .order('display_order', { ascending: true });
        return toArray(data);
    },

    async create(banner: {
        title?: string;
        image_url?: string;
        video_url?: string;
        link?: string;
        active?: boolean;
        display_order?: number;
    }) {
        const { data, error } = await supabaseAdmin
            .from('banners')
            .insert(banner)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: number, banner: {
        title?: string;
        image_url?: string;
        video_url?: string;
        link?: string;
        active?: boolean;
        display_order?: number;
    }) {
        const { data, error } = await supabaseAdmin
            .from('banners')
            .update(banner)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from('banners')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Activities
export const activities = {
    async getAll() {
        const { data } = await supabaseAdmin
            .from('activities')
            .select('*')
            .order('display_order', { ascending: true });
        return toArray(data);
    },

    async getActive() {
        const { data } = await supabaseAdmin
            .from('activities')
            .select('*')
            .eq('active', true)
            .order('display_order', { ascending: true });
        return toArray(data);
    },

    async create(activity: {
        title?: string;
        description?: string;
        image_url?: string;
        video_url?: string;
        link?: string;
        active?: boolean;
        display_order?: number;
    }) {
        const { data, error } = await supabaseAdmin
            .from('activities')
            .insert(activity)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: number, activity: {
        title?: string;
        description?: string;
        image_url?: string;
        video_url?: string;
        link?: string;
        active?: boolean;
        display_order?: number;
    }) {
        const { data, error } = await supabaseAdmin
            .from('activities')
            .update(activity)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: number) {
        const { error } = await supabaseAdmin
            .from('activities')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Exportar como default para compatibilidade
export default {
    users,
    posts,
    banners,
    activities
};
