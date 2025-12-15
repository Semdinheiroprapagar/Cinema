import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/database';
import slugify from 'slugify';
import { getSession } from '@/lib/auth';

export async function GET() {
    // Temporarily disabled auth check - TODO: Fix session handling
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const posts = await db.posts.getAll();
        return NextResponse.json(posts);
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Temporarily disabled auth check - TODO: Fix session handling
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { title, content, excerpt, cover_image, category, content_type, video_url, rating, published, list_items } = body;

        let slug = slugify(title, { lower: true, strict: true });

        if (!slug) {
            return NextResponse.json({ error: 'Título inválido para geração de slug' }, { status: 400 });
        }

        // Ensure unique slug
        let uniqueSlug = slug;
        let counter = 1;

        while (true) {
            const existing = await db.posts.getBySlug(uniqueSlug);
            if (!existing) break;
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const newPost = await db.posts.create({
            title,
            slug: uniqueSlug,
            content,
            excerpt,
            cover_image,
            category,
            content_type: content_type || 'post',
            video_url: video_url || undefined,
            rating: rating || 0,
            published: published || false,
            list_items: list_items ? JSON.stringify(list_items) : undefined,
        });

        revalidatePath('/');
        return NextResponse.json({ id: newPost.id, slug: uniqueSlug });
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
