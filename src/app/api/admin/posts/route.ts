import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';
import slugify from 'slugify';
import { getSession } from '@/lib/auth';

export async function GET() {
    // Temporarily disabled auth check - TODO: Fix session handling
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
    const posts = stmt.all();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    // Temporarily disabled auth check - TODO: Fix session handling
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, excerpt, cover_image, category, content_type, video_url, rating, published } = body;

    let slug = slugify(title, { lower: true, strict: true });

    if (!slug) {
        return NextResponse.json({ error: 'Título inválido para geração de slug' }, { status: 400 });
    }

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
        const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(uniqueSlug);
        if (!existing) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    try {
        const stmt = db.prepare(`
      INSERT INTO posts (title, slug, content, excerpt, cover_image, category, content_type, video_url, rating, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            title,
            uniqueSlug,
            content,
            excerpt,
            cover_image,
            category,
            content_type || 'post',
            video_url || null,
            rating || 0,
            published ? 1 : 0
        );

        revalidatePath('/');
        return NextResponse.json({ id: info.lastInsertRowid, slug });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
