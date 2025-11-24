import { NextResponse } from 'next/server';
import db from '@/lib/db';
import slugify from 'slugify';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = stmt.get(id);

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, cover_image, category, published } = body;

    // Optionally update slug if title changes, but usually better to keep slug stable or make it optional
    // For now, let's keep slug stable unless explicitly requested, or just update it.
    // Let's update it for simplicity if title changed.
    const slug = slugify(title, { lower: true, strict: true });

    try {
        const stmt = db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, cover_image = ?, category = ?, published = ?
      WHERE id = ?
    `);

        stmt.run(title, slug, content, excerpt, cover_image, category, published ? 1 : 0, id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
}
