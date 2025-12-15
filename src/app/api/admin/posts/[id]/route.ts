import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import slugify from 'slugify';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const post = await db.posts.getById(parseInt(id));

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, excerpt, cover_image, category, content_type, video_url, rating, published, list_items } = body;

        const slug = slugify(title, { lower: true, strict: true });

        await db.posts.update(parseInt(id), {
            title,
            slug,
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

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        await db.posts.delete(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
