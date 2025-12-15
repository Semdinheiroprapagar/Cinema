import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
    try {
        const activities = await db.activities.getAll();
        return NextResponse.json(activities);
    } catch (error: any) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, image_url, video_url, link } = body;

        const activity = await db.activities.create({
            title,
            description,
            image_url,
            video_url,
            link,
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error: any) {
        console.error('Error creating activity:', error);
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

        await db.activities.delete(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting activity:', error);
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
}
