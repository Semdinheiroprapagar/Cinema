/**
 * Diagnóstico de Ambiente Vercel
 * 
 * Este arquivo pode ser acessado via /api/diagnostics para verificar
 * se as variáveis de ambiente estão configuradas corretamente.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseType: process.env.DATABASE_TYPE,
        checks: {
            DATABASE_TYPE: {
                value: process.env.DATABASE_TYPE ? '✅ Configurado' : '❌ Ausente',
                expected: 'supabase'
            },
            NEXT_PUBLIC_SUPABASE_URL: {
                value: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Ausente',
                preview: process.env.NEXT_PUBLIC_SUPABASE_URL ?
                    process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' :
                    'N/A'
            },
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {
                value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Ausente',
                preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30) + '...' :
                    'N/A'
            },
            SUPABASE_SERVICE_ROLE_KEY: {
                value: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Ausente',
                preview: process.env.SUPABASE_SERVICE_ROLE_KEY ?
                    process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 30) + '...' :
                    'N/A'
            },
            JWT_SECRET: {
                value: process.env.JWT_SECRET ? '✅ Configurado' : '❌ Ausente',
                preview: process.env.JWT_SECRET ?
                    process.env.JWT_SECRET.substring(0, 20) + '...' :
                    'N/A'
            }
        },
        allConfigured: !!(
            process.env.DATABASE_TYPE &&
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
            process.env.SUPABASE_SERVICE_ROLE_KEY &&
            process.env.JWT_SECRET
        )
    };

    return NextResponse.json(diagnostics, {
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
}
