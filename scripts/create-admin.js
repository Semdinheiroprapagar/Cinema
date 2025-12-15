/**
 * Script para criar usuário admin no Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function createAdminUser() {
    console.log('👤 Criando usuário admin no Supabase...\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Verificar se usuário já existe
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('username', adminUsername)
            .single();

        if (existingUser) {
            console.log(`⏭️  Usuário '${adminUsername}' já existe`);
            console.log(`   ID: ${existingUser.id}`);
            console.log(`   Criado em: ${existingUser.created_at}\n`);
            return;
        }

        // Criar hash da senha
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Inserir usuário
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                username: adminUsername,
                password_hash: passwordHash
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        console.log(`✅ Usuário admin criado com sucesso!`);
        console.log(`   Username: ${adminUsername}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`   ID: ${newUser.id}\n`);
        console.log(`🔐 Você pode fazer login em: /admin/login\n`);

    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error.message);
        process.exit(1);
    }
}

createAdminUser();
