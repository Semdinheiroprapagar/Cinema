import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                results: [],
                query: '',
                count: 0
            });
        }

        console.log('[Search API] Searching for:', query);

        const results = await db.posts.search(query);

        console.log(`[Search API] Found ${results.length} results`);

        return NextResponse.json({
            results,
            query,
            count: results.length
        });
    } catch (error: any) {
        console.error('[Search API] Error:', error);
        return NextResponse.json(
            { error: 'Search failed', details: error.message },
            { status: 500 }
        );
    }
}
