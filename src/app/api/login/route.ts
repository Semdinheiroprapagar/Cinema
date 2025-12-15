import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = await db.users.findByUsername(username);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user: { id: user.id, username: user.username }, expires });

        (await cookies()).set('session', session, { expires, httpOnly: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
