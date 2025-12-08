/**
 * Script de migração do SQLite para Supabase
 * 
 * Este script:
 * 1. Lê os dados do banco SQLite local
 * 2. Envia para o Supabase (PostgreSQL)
 * 3. Faz upload das imagens para o Supabase Storage
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente no .env.local
 * 2. Execute: node scripts/migrate-to-supabase.js
 */

const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente (ordem: .env.local > .env)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Abrir banco SQLite
const dbPath = path.join(process.cwd(), 'cinema.db');
if (!fs.existsSync(dbPath)) {
    console.error('❌ Erro: Banco de dados cinema.db não encontrado');
    process.exit(1);
}

const db = new Database(dbPath);

async function migrateUsers() {
    console.log('\n📤 Migrando usuários...');

    const users = db.prepare('SELECT * FROM users').all();

    if (users.length === 0) {
        console.log('⚠️  Nenhum usuário encontrado');
        return;
    }

    for (const user of users) {
        const { error } = await supabase
            .from('users')
            .insert({
                username: user.username,
                password_hash: user.password_hash,
            });

        if (error && error.code !== '23505') { // 23505 = duplicate key
            console.error(`❌ Erro ao migrar usuário ${user.username}:`, error.message);
        } else {
            console.log(`✅ Usuário migrado: ${user.username}`);
        }
    }
}

async function migratePosts() {
    console.log('\n📤 Migrando posts...');

    const posts = db.prepare('SELECT * FROM posts').all();

    if (posts.length === 0) {
        console.log('⚠️  Nenhum post encontrado');
        return;
    }

    for (const post of posts) {
        const { error } = await supabase
            .from('posts')
            .insert({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt,
                cover_image: post.cover_image,
                category: post.category,
                content_type: post.content_type || 'post',
                video_url: post.video_url,
                media_files: post.media_files,
                rating: post.rating || 0,
                published: Boolean(post.published),
                created_at: post.created_at,
            });

        if (error && error.code !== '23505') {
            console.error(`❌ Erro ao migrar post ${post.title}:`, error.message);
        } else {
            console.log(`✅ Post migrado: ${post.title}`);
        }
    }
}

async function migrateBanners() {
    console.log('\n📤 Migrando banners...');

    const banners = db.prepare('SELECT * FROM banners').all();

    if (banners.length === 0) {
        console.log('⚠️  Nenhum banner encontrado');
        return;
    }

    for (const banner of banners) {
        const { error } = await supabase
            .from('banners')
            .insert({
                title: banner.title,
                image_url: banner.image_url,
                video_url: banner.video_url,
                link: banner.link,
                active: Boolean(banner.active),
                display_order: banner.display_order || 0,
            });

        if (error) {
            console.error(`❌ Erro ao migrar banner ${banner.title}:`, error.message);
        } else {
            console.log(`✅ Banner migrado: ${banner.title || 'Sem título'}`);
        }
    }
}

async function migrateActivities() {
    console.log('\n📤 Migrando atividades...');

    const activities = db.prepare('SELECT * FROM activities').all();

    if (activities.length === 0) {
        console.log('⚠️  Nenhuma atividade encontrada');
        return;
    }

    for (const activity of activities) {
        const { error } = await supabase
            .from('activities')
            .insert({
                title: activity.title,
                description: activity.description,
                image_url: activity.image_url,
                video_url: activity.video_url,
                link: activity.link,
                active: Boolean(activity.active),
                display_order: activity.display_order || 0,
            });

        if (error) {
            console.error(`❌ Erro ao migrar atividade ${activity.title}:`, error.message);
        } else {
            console.log(`✅ Atividade migrada: ${activity.title || 'Sem título'}`);
        }
    }
}

async function uploadImages() {
    console.log('\n📤 Fazendo upload de imagens...');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
        console.log('⚠️  Pasta de uploads não encontrada');
        return;
    }

    const files = fs.readdirSync(uploadsDir);

    if (files.length === 0) {
        console.log('⚠️  Nenhuma imagem encontrada');
        return;
    }

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);

        // Ignorar diretórios, processar apenas arquivos
        if (fs.statSync(filePath).isDirectory()) {
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);

        const { error } = await supabase.storage
            .from('uploads')
            .upload(file, fileBuffer, {
                contentType: `image/${path.extname(file).slice(1)}`,
                upsert: true
            });

        if (error) {
            console.error(`❌ Erro ao fazer upload de ${file}:`, error.message);
        } else {
            console.log(`✅ Imagem enviada: ${file}`);
        }
    }
}

async function main() {
    console.log('🚀 Iniciando migração do SQLite para Supabase...\n');

    try {
        await migrateUsers();
        await migratePosts();
        await migrateBanners();
        await migrateActivities();
        await uploadImages();

        console.log('\n✅ Migração concluída com sucesso! 🎉');
        console.log('\n📝 Próximos passos:');
        console.log('1. Teste o site localmente: npm run dev');
        console.log('2. Verifique os dados no dashboard do Supabase');
        console.log('3. Faça o deploy na Vercel');

    } catch (error) {
        console.error('\n❌ Erro durante a migração:', error);
        process.exit(1);
    } finally {
        db.close();
    }
}

main();
