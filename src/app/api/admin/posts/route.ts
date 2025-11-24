import { NextResponse } from 'next/server';
import db from '@/lib/db';
import slugify from 'slugify';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
    const posts = stmt.all();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, excerpt, cover_image, category, content_type, video_url, rating, published } = body;

    const slug = slugify(title, { lower: true, strict: true });

    try {
        const stmt = db.prepare(`
      INSERT INTO posts (title, slug, content, excerpt, cover_image, category, content_type, video_url, rating, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            title,
            slug,
            content,
            excerpt,
            cover_image,
            category,
            content_type || 'post',
            video_url || null,
            rating || 0,
            published ? 1 : 0
        );

        return NextResponse.json({ id: info.lastInsertRowid, slug });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
