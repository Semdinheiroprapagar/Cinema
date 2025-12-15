/**
 * Script para fazer deploy do schema SQL no Supabase
 * 
 * Este script gera instruções para executar o schema manualmente no Supabase SQL Editor
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

function deploySchema() {
    console.log('🚀 Deploy do Schema no Supabase\n');
    console.log('='.repeat(70));

    // Verificar credenciais
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
        console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL não configurado');
        process.exit(1);
    }

    // Extrair project ref
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

    if (!projectRef) {
        console.error('❌ Erro: URL do Supabase inválida');
        process.exit(1);
    }

    // Ler arquivo SQL
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error('❌ Erro: Arquivo supabase-schema.sql não encontrado');
        process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // URL do SQL Editor
    const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

    console.log('\n📝 INSTRUÇÕES PARA DEPLOY:\n');
    console.log('1. Acesse o Supabase SQL Editor:');
    console.log(`   \x1b[36m${sqlEditorUrl}\x1b[0m\n`);
    console.log('2. Copie TODO o SQL abaixo (incluindo comentários):');
    console.log('='.repeat(70));
    console.log(schemaSql);
    console.log('='.repeat(70));
    console.log('\n3. Cole no SQL Editor e clique em "RUN"\n');
    console.log('4. Aguarde a execução completar\n');
    console.log('5. Verifique se as tabelas foram criadas executando:');
    console.log('   \x1b[32mnode scripts/setup-database.js\x1b[0m\n');
    console.log('='.repeat(70));
    console.log('\n💡 DICA: O SQL usa "CREATE IF NOT EXISTS", então é seguro');
    console.log('   executar múltiplas vezes sem problemas.\n');
}

// Executar
deploySchema();
