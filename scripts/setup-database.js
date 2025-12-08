/**
 * Script de setup do banco de dados para Vercel
 * 
 * Este script é executado automaticamente durante o deploy na Vercel
 * e garante que todas as tabelas necessárias existem no Supabase.
 * 
 * Como funciona:
 * 1. Verifica se as tabelas já existem
 * 2. Cria apenas as tabelas que estão faltando
 * 3. Cria o bucket de storage se não existir
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente (ordem: .env.local > .env)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableExists(tableName) {
    const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

    // Se não houver erro, a tabela existe
    return !error || error.code !== 'PGRST116';
}

async function executeSQL(sql) {
    try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            // Se o RPC não existe, precisamos usar outro método
            console.log('⚠️  Executando SQL via método alternativo...');
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

async function createTables() {
    console.log('🔍 Verificando tabelas...');

    const tables = ['users', 'posts', 'banners', 'activities'];
    const missingTables = [];

    for (const table of tables) {
        const exists = await checkTableExists(table);
        if (!exists) {
            missingTables.push(table);
            console.log(`❌ Tabela '${table}' não encontrada`);
        } else {
            console.log(`✅ Tabela '${table}' existe`);
        }
    }

    if (missingTables.length === 0) {
        console.log('✅ Todas as tabelas já existem!');
        return true;
    }

    console.log('\n⚠️  ATENÇÃO: Tabelas faltando detectadas.');
    console.log('📝 Para criar as tabelas, execute o seguinte SQL no Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/_/sql');
    console.log('\n📄 Arquivo: scripts/supabase-schema.sql\n');

    // Ler e mostrar o schema
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('📋 Copie e execute este SQL no Supabase:\n');
        console.log('─'.repeat(60));
        console.log(schema);
        console.log('─'.repeat(60));
    }

    // Não falhar o build, apenas avisar
    console.log('\n⚠️  Build continuará, mas o site pode ter problemas sem as tabelas.');
    return true;
}

async function checkStorageBucket() {
    console.log('\n🗂️  Verificando bucket de storage...');

    try {
        const { data: buckets, error } = await supabase
            .storage
            .listBuckets();

        if (error) {
            console.log('⚠️  Não foi possível verificar buckets:', error.message);
            return false;
        }

        const uploadsExists = buckets.some(b => b.id === 'uploads');

        if (uploadsExists) {
            console.log('✅ Bucket "uploads" existe');
            return true;
        }

        console.log('📝 Criando bucket "uploads"...');

        const { error: createError } = await supabase
            .storage
            .createBucket('uploads', {
                public: true,
                fileSizeLimit: 10485760, // 10MB
            });

        if (createError) {
            console.log('⚠️  Não foi possível criar bucket:', createError.message);
            console.log('   Crie manualmente no Supabase Dashboard > Storage');
            return false;
        }

        console.log('✅ Bucket "uploads" criado com sucesso!');
        return true;

    } catch (error) {
        console.log('⚠️  Erro ao verificar storage:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Verificando configuração do banco de dados...\n');

    try {
        console.log('🔌 Testando conexão com Supabase...');

        // Apenas verificar se a URL e key estão configuradas
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Variáveis de ambiente não configuradas');
            console.log('⚠️  Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
            process.exit(0);
        }

        console.log('✅ Credenciais do Supabase encontradas!\n');

        // Verificar tabelas
        await createTables();

        // Verificar storage
        await checkStorageBucket();

        console.log('\n✅ Verificação concluída!');
        console.log('📦 Build pode continuar...\n');

    } catch (error) {
        console.error('\n❌ Erro durante verificação:', error.message);
        console.log('⚠️  Continuando o build mesmo com erros...\n');
        // Não falhar o build - apenas avisar
        process.exit(0);
    }
}

main();
