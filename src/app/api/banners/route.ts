import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM banners ORDER BY display_order ASC');
        const banners = stmt.all();
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, image_url, link } = body;

        const stmt = db.prepare('INSERT INTO banners (title, image_url, link) VALUES (?, ?, ?)');
        const result = stmt.run(title, image_url, link);

        return NextResponse.json({ id: result.lastInsertRowid, title, image_url, link }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM banners WHERE id = ?');
        stmt.run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
