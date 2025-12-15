import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/database';

export async function GET() {
    try {
        const banners = await db.banners.getAll();
        return NextResponse.json(banners);
    } catch (error: any) {
        console.error('Error fetching banners:', error);
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, image_url, link, video_url } = body;

        const banner = await db.banners.create({
            title,
            image_url,
            video_url,
            link,
        });

        revalidatePath('/');
        return NextResponse.json(banner, { status: 201 });
    } catch (error: any) {
        console.error('Error creating banner:', error);
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

        await db.banners.delete(parseInt(id));

        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting banner:', error);
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
