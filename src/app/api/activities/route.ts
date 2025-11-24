import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM activities ORDER BY display_order ASC');
        const activities = stmt.all();
        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, image_url, link } = body;

        const stmt = db.prepare('INSERT INTO activities (title, description, image_url, link) VALUES (?, ?, ?, ?)');
        const result = stmt.run(title, description, image_url, link);

        return NextResponse.json({ id: result.lastInsertRowid, title, description, image_url, link }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM activities WHERE id = ?');
        stmt.run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
}
