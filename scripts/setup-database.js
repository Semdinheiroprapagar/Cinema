/**
 * Script de setup do banco de dados
 * 
 * Suporta SQLite (desenvolvimento) e Supabase (produção)
 * Detecta automaticamente qual banco usar baseado em DATABASE_TYPE
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const databaseType = process.env.DATABASE_TYPE || 'sqlite';

console.log(`🚀 Configurando banco de dados: ${databaseType.toUpperCase()}\n`);

if (databaseType === 'sqlite') {
    setupSQLite();
} else if (databaseType === 'supabase') {
    setupSupabase();
} else {
    console.error(`❌ DATABASE_TYPE inválido: ${databaseType}`);
    console.error('   Valores válidos: sqlite, supabase');
    process.exit(1);
}

// ==================== SQLite Setup ====================

function setupSQLite() {
    console.log('📦 Configurando SQLite...\n');

    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'cinema.db');

        console.log(`📁 Caminho do banco: ${dbPath}`);

        const db = new Database(dbPath);

        console.log('✅ Conexão estabelecida!');
        console.log('🔨 Criando tabelas...\n');

        // Criar tabelas
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                cover_image TEXT,
                category TEXT NOT NULL,
                content_type TEXT DEFAULT 'post',
                video_url TEXT,
                media_files TEXT,
                rating INTEGER DEFAULT 0,
                published BOOLEAN DEFAULT 0,
                list_items TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS banners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                image_url TEXT,
                video_url TEXT,
                link TEXT,
                active BOOLEAN DEFAULT 1,
                display_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                image_url TEXT,
                video_url TEXT,
                link TEXT,
                active BOOLEAN DEFAULT 1,
                display_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Tabela users criada');
        console.log('✅ Tabela posts criada');
        console.log('✅ Tabela banners criada');
        console.log('✅ Tabela activities criada');

        // Executar migrações
        console.log('\n🔄 Executando migrações...\n');

        const migrations = [
            { sql: 'ALTER TABLE posts ADD COLUMN rating INTEGER DEFAULT 0', name: 'rating' },
            { sql: 'ALTER TABLE posts ADD COLUMN content_type TEXT DEFAULT "post"', name: 'content_type' },
            { sql: 'ALTER TABLE posts ADD COLUMN video_url TEXT', name: 'video_url' },
            { sql: 'ALTER TABLE posts ADD COLUMN media_files TEXT', name: 'media_files' },
            { sql: 'ALTER TABLE posts ADD COLUMN list_items TEXT', name: 'list_items' },
            { sql: 'ALTER TABLE banners ADD COLUMN video_url TEXT', name: 'banners.video_url' },
            { sql: 'ALTER TABLE activities ADD COLUMN video_url TEXT', name: 'activities.video_url' },
        ];

        for (const migration of migrations) {
            try {
                db.exec(migration.sql);
                console.log(`✅ Migração ${migration.name} aplicada`);
            } catch (error) {
                // Coluna já existe, ignorar
                console.log(`⏭️  Migração ${migration.name} já aplicada`);
            }
        }

        // Criar diretório de uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('\n📁 Diretório de uploads criado');
        }

        db.close();

        console.log('\n✅ SQLite configurado com sucesso!');
        console.log('📦 Arquivo: cinema.db\n');

    } catch (error) {
        console.error('\n❌ Erro ao configurar SQLite:', error.message);
        process.exit(1);
    }
}

// ==================== Supabase Setup ====================

async function setupSupabase() {
    console.log('☁️  Configurando Supabase...\n');

    const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Erro: Configure as variáveis de ambiente:');
        console.error('   - NEXT_PUBLIC_SUPABASE_URL');
        console.error('   - SUPABASE_SERVICE_ROLE_KEY\n');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        console.log('🔌 Testando conexão...');

        // Verificar tabelas
        const tables = ['users', 'posts', 'banners', 'activities'];
        const missingTables = [];

        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .select('id')
                .limit(1);

            if (error && error.code === 'PGRST116') {
                // Tabela não existe
                missingTables.push(table);
                console.log(`❌ Tabela '${table}' não encontrada`);
            } else if (error) {
                console.log(`⚠️  Erro ao verificar tabela '${table}':`, error.message);
            } else {
                console.log(`✅ Tabela '${table}' existe`);
            }
        }

        // Verificar storage bucket
        console.log('\n🗂️  Verificando bucket de storage...');

        const { data: buckets, error: bucketsError } = await supabase
            .storage
            .listBuckets();

        if (bucketsError) {
            console.log('⚠️  Não foi possível verificar buckets:', bucketsError.message);
        } else {
            const uploadsExists = buckets.some(b => b.id === 'uploads');

            if (uploadsExists) {
                console.log('✅ Bucket "uploads" existe');
            } else {
                console.log('❌ Bucket "uploads" não encontrado');
                missingTables.push('storage-bucket');
            }
        }

        if (missingTables.length === 0) {
            console.log('\n✅ Supabase configurado corretamente!\n');
            process.exit(0);
        }

        // Mostrar instruções para criar tabelas
        console.log('\n⚠️  ATENÇÃO: Configuração incompleta detectada.');
        console.log('\n📝 Execute o seguinte SQL no Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/_/sql\n');

        const schemaPath = path.join(__dirname, 'supabase-schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            console.log('📋 Copie e execute este SQL:\n');
            console.log('─'.repeat(60));
            console.log(schema);
            console.log('─'.repeat(60));
        }

        console.log('\n⚠️  Build continuará, mas o site pode ter problemas sem as tabelas.\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erro ao configurar Supabase:', error.message);
        console.log('⚠️  Continuando o build mesmo com erros...\n');
        process.exit(0);
    }
}
