# 🎬 CinemaSite - Migração para Supabase

## 📝 Resumo

O projeto foi preparado para migração do SQLite para Supabase (PostgreSQL na nuvem). Isso resolve os problemas de deploy na Vercel.

---

## 🚀 Passo a Passo Completo

### 1️⃣ Criar Conta e Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub
4. Clique em **"New Project"**
5. Configure:
   - **Name**: `cinema-site`
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: `South America (São Paulo)`
   - **Pricing Plan**: Free
6. Clique em **"Create new project"**
7. ⏳ Aguarde 2-3 minutos

---

### 2️⃣ Configurar o Schema do Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor** (ícone de banco de dados)
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `scripts/supabase-schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione Ctrl+Enter)
6. ✅ Você deve ver: "Success. No rows returned"

Isso criará todas as tabelas (users, posts, banners, activities) e configurará as permissões.

---

### 3️⃣ Configurar Variáveis de Ambiente

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public key**
   - **service_role key** (clique em "Reveal" para ver)

3. Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

4. Edite `.env.local` e preencha com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...sua-chave-aqui
DATABASE_URL=postgresql://postgres:SUA-SENHA@db.seu-projeto.supabase.co:5432/postgres
JWT_SECRET=mude-isso-para-algo-super-seguro
```

⚠️ **IMPORTANTE**: Substitua:
- `seu-projeto` pelo ID do seu projeto
- `SUA-SENHA` pela senha que você criou
- `JWT_SECRET` por uma string aleatória segura

---

### 4️⃣ Migrar os Dados do SQLite para Supabase

Execute o script de migração:

```bash
node scripts/migrate-to-supabase.js
```

Este script vai:
- ✅ Migrar todos os usuários
- ✅ Migrar todos os posts
- ✅ Migrar todos os banners
- ✅ Migrar todas as atividades
- ✅ Fazer upload de todas as imagens para o Supabase Storage

---

### 5️⃣ Atualizar o Código para Usar Supabase

Renomeie o arquivo de banco de dados:

```bash
# Fazer backup do db.ts antigo
mv src/lib/db.ts src/lib/db-sqlite-backup.ts

# Usar a nova versão com Supabase
mv src/lib/db-supabase.ts src/lib/db.ts
```

---

### 6️⃣ Testar Localmente

```bash
npm run dev
```

Acesse:
- **Site público**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

Teste:
- ✅ Visualizar posts
- ✅ Criar novo post
- ✅ Upload de imagens
- ✅ Banners e atividades

---

### 7️⃣ Deploy na Vercel

#### Configurar Variáveis de Ambiente na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `JWT_SECRET` | `seu-secret-key` | Production, Preview, Development |

#### Fazer Deploy

```bash
git add .
git commit -m "Migração para Supabase - Deploy pronto"
git push
```

A Vercel vai automaticamente fazer o deploy! 🚀

---

## 🎯 Checklist de Migração

- [ ] Conta criada no Supabase
- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Script de migração executado com sucesso
- [ ] Código atualizado (`db.ts` substituído)
- [ ] Teste local funcionando
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado
- [ ] Site funcionando na Vercel

---

## 🔧 Comandos Úteis

```bash
# Testar build de produção localmente
npm run build
npm start

# Ver logs do Supabase (se houver erros)
# Acesse: Dashboard → Logs

# Resetar banco de dados (CUIDADO!)
# Execute novamente o schema SQL no SQL Editor
```

---

## 🆘 Problemas Comuns

### Erro: "Invalid API key"
- Verifique se copiou as chaves corretas do Supabase
- Certifique-se de usar `service_role` key para operações admin

### Erro: "relation does not exist"
- Execute o schema SQL novamente no SQL Editor
- Verifique se todas as tabelas foram criadas

### Imagens não carregam
- Verifique se o bucket "uploads" foi criado
- Vá em **Storage** no Supabase e verifique as políticas

### Erro de autenticação no admin
- Verifique se o `JWT_SECRET` está configurado
- Certifique-se de que o usuário foi migrado

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Vercel + Supabase](https://vercel.com/guides/using-supabase-with-vercel)

---

## ✅ Próximos Passos Após Deploy

1. **Configurar domínio personalizado** (opcional)
2. **Configurar backups automáticos** no Supabase
3. **Monitorar uso** no dashboard do Supabase
4. **Otimizar queries** se necessário

---

**Pronto! Seu site agora está preparado para funcionar perfeitamente na Vercel! 🎉**
