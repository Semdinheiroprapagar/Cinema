/**
 * Script para fazer upload da imagem de perfil para o Supabase Storage
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadProfileImage() {
    console.log('📸 Fazendo upload da imagem de perfil para Supabase Storage...\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Erro: Configure as variáveis de ambiente Supabase');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ler a imagem
    const imagePath = path.join(process.cwd(), 'public', 'uploads', 'perfil.png');

    if (!fs.existsSync(imagePath)) {
        console.error('❌ Erro: Imagem não encontrada em', imagePath);
        process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const storagePath = 'images/perfil.png';

    console.log('📤 Fazendo upload para:', storagePath);

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
        .from('uploads')
        .upload(storagePath, imageBuffer, {
            contentType: 'image/png',
            upsert: true // Sobrescrever se já existir
        });

    if (error) {
        console.error('❌ Erro no upload:', error.message);
        process.exit(1);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(storagePath);

    console.log('\n✅ Upload realizado com sucesso!');
    console.log('📍 URL pública:', publicUrl);
    console.log('\n💡 Atualize o código para usar esta URL:');
    console.log(`   src="${publicUrl}"`);
}

uploadProfileImage().catch(console.error);
