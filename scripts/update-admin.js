/**
 * Script para atualizar credenciais do usuário admin no Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function updateAdminCredentials() {
    console.log('🔐 Atualizando credenciais do admin...\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Novas credenciais
    const newUsername = 'fragmentosdocinema@gmail.com';
    const newPassword = 'Fragmentos007!';

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Erro: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Buscar o usuário admin atual (ID 1)
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', 1)
            .single();

        if (!existingUser) {
            console.log('❌ Usuário admin (ID 1) não encontrado');
            console.log('   Criando novo usuário...\n');

            // Criar hash da senha
            const passwordHash = await bcrypt.hash(newPassword, 10);

            // Inserir novo usuário
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    username: newUsername,
                    password_hash: passwordHash
                })
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Novo usuário admin criado!');
            console.log(`   Username: ${newUsername}`);
            console.log(`   Password: ${newPassword}`);
            console.log(`   ID: ${newUser.id}\n`);
            return;
        }

        console.log(`📝 Usuário atual: ${existingUser.username}`);
        console.log(`   Atualizando para: ${newUsername}\n`);

        // Criar hash da nova senha
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Atualizar usuário
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({
                username: newUsername,
                password_hash: passwordHash
            })
            .eq('id', 1)
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Credenciais atualizadas com sucesso!');
        console.log(`   Username: ${newUsername}`);
        console.log(`   Password: ${newPassword}`);
        console.log(`   ID: ${updatedUser.id}\n`);
        console.log('🔐 Você pode fazer login em: /admin/login\n');

    } catch (error) {
        console.error('❌ Erro ao atualizar credenciais:', error.message);
        process.exit(1);
    }
}

updateAdminCredentials();
