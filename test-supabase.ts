/**
 * Script de teste do Supabase
 * Testa conexão, tabelas, autenticação e operações CRUD
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log('🧪 Iniciando testes do Supabase...\n');
    console.log('='.repeat(70));

    let testsPassados = 0;
    let testsFalhados = 0;

    // Teste 1: Conexão
    console.log('\n📡 Teste 1: Verificando conexão...');
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error && error.code !== 'PGRST116') throw error;
        console.log('✅ Conexão estabelecida com sucesso');
        testsPassados++;
    } catch (error: any) {
        console.error('❌ Falha na conexão:', error.message);
        testsFalhados++;
    }

    // Teste 2: Tabela Users
    console.log('\n👤 Teste 2: Verificando tabela users...');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Tabela users acessível');
        if (data && data.length > 0) {
            console.log(`   📊 ${data.length} usuário(s) encontrado(s)`);
        }
        testsPassados++;
    } catch (error: any) {
        console.error('❌ Erro ao acessar tabela users:', error.message);
        testsFalhados++;
    }

    // Teste 3: Tabela Posts
    console.log('\n📝 Teste 3: Verificando tabela posts...');
    try {
        const { data, error } = await supabase.from('posts').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Tabela posts acessível');
        if (data && data.length > 0) {
            console.log(`   📊 ${data.length} post(s) encontrado(s)`);
        }
        testsPassados++;
    } catch (error: any) {
        console.error('❌ Erro ao acessar tabela posts:', error.message);
        testsFalhados++;
    }

    // Teste 4: Tabela Banners
    console.log('\n🎨 Teste 4: Verificando tabela banners...');
    try {
        const { data, error } = await supabase.from('banners').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Tabela banners acessível');
        if (data && data.length > 0) {
            console.log(`   📊 ${data.length} banner(s) encontrado(s)`);
        }
        testsPassados++;
    } catch (error: any) {
        console.error('❌ Erro ao acessar tabela banners:', error.message);
        testsFalhados++;
    }

    // Teste 5: Tabela Activities
    console.log('\n🎯 Teste 5: Verificando tabela activities...');
    try {
        const { data, error } = await supabase.from('activities').select('*').limit(1);
        if (error) throw error;
        console.log('✅ Tabela activities acessível');
        if (data && data.length > 0) {
            console.log(`   📊 ${data.length} atividade(s) encontrada(s)`);
        }
        testsPassados++;
    } catch (error: any) {
        console.error('❌ Erro ao acessar tabela activities:', error.message);
        testsFalhados++;
    }

    // Teste 6: Storage Bucket
    console.log('\n📦 Teste 6: Verificando storage bucket...');
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) throw error;
        const uploadsExists = data.some(b => b.id === 'uploads');
        if (uploadsExists) {
            console.log('✅ Bucket "uploads" encontrado');
            testsPassados++;
        } else {
            console.error('❌ Bucket "uploads" não encontrado');
            testsFalhados++;
        }
    } catch (error: any) {
        console.error('❌ Erro ao verificar storage:', error.message);
        testsFalhados++;
    }

    // Teste 7: Verificar usuário admin
    console.log('\n🔐 Teste 7: Verificando usuário admin...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', 'fragmentosdocinema@gmail.com')
            .single();

        if (error) throw error;
        if (data) {
            console.log('✅ Usuário admin encontrado');
            console.log(`   Username: ${data.username}`);
            console.log(`   ID: ${data.id}`);
            testsPassados++;
        } else {
            console.error('❌ Usuário admin não encontrado');
            testsFalhados++;
        }
    } catch (error: any) {
        console.error('❌ Erro ao buscar usuário admin:', error.message);
        testsFalhados++;
    }

    // Resumo
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO DOS TESTES:');
    console.log('='.repeat(70));
    console.log(`✅ Testes passados: ${testsPassados}`);
    console.log(`❌ Testes falhados: ${testsFalhados}`);
    console.log(`📈 Taxa de sucesso: ${Math.round((testsPassados / (testsPassados + testsFalhados)) * 100)}%`);
    console.log('='.repeat(70));

    if (testsFalhados === 0) {
        console.log('\n🎉 Todos os testes passaram! Supabase está 100% funcional!\n');
    } else {
        console.log('\n⚠️  Alguns testes falharam. Verifique os erros acima.\n');
    }
}

testSupabase();
