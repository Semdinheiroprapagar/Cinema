# 🚀 INÍCIO RÁPIDO - Migração para Supabase

## ⏱️ Tempo estimado: 15 minutos

---

## 📍 PASSO 1: Criar Projeto no Supabase

### Acesse agora:
👉 **https://supabase.com**

### O que fazer:
1. Clique em **"Start your project"**
2. Login com **GitHub** (mais fácil)
3. Clique em **"New Project"** (botão verde)
4. Preencha:
   ```
   Nome: cinema-site
   Senha: [CRIE UMA SENHA FORTE E ANOTE AQUI]
   Região: South America (São Paulo)
   Plan: Free
   ```
5. Clique em **"Create new project"**
6. ⏳ Aguarde 2-3 minutos (vai aparecer uma barra de progresso)

---

## 📍 PASSO 2: Criar as Tabelas

### Quando o projeto estiver pronto:

1. No menu lateral, clique em **SQL Editor** (ícone 📊)
2. Clique em **"New query"**
3. Abra o arquivo `scripts/supabase-schema.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou Ctrl+Enter)
7. ✅ Deve aparecer: **"Success. No rows returned"**

---

## 📍 PASSO 3: Copiar as Credenciais

### No Supabase:

1. Vá em **Settings** (⚙️ no menu lateral)
2. Clique em **API**
3. Você verá:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGc...
service_role: [clique em "Reveal" para ver]
```

### ANOTE ESSAS 3 INFORMAÇÕES! Você vai precisar delas.

---

## 📍 PASSO 4: Configurar o Projeto

### No terminal, execute:

```bash
# 1. Copiar template de variáveis
cp .env.example .env.local

# 2. Abrir o arquivo para editar
open .env.local
```

### Cole suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:SUA-SENHA@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=mude-para-algo-aleatorio-e-seguro
```

⚠️ Substitua:
- `xxxxx` pelo ID do seu projeto
- `SUA-SENHA` pela senha que você criou
- `JWT_SECRET` por qualquer string aleatória

---

## 📍 PASSO 5: Migrar os Dados

### Execute no terminal:

```bash
node scripts/migrate-to-supabase.js
```

Você verá:
```
🚀 Iniciando migração...
✅ Usuário migrado: admin
✅ Post migrado: Título do Post
✅ Imagem enviada: imagem.jpg
✅ Migração concluída! 🎉
```

---

## 📍 PASSO 6: Atualizar o Código

### Execute:

```bash
# Backup do arquivo antigo
mv src/lib/db.ts src/lib/db-sqlite-backup.ts

# Usar nova versão com Supabase
mv src/lib/db-supabase.ts src/lib/db.ts
```

---

## 📍 PASSO 7: Testar

### Execute:

```bash
npm run dev
```

### Teste:
- ✅ Abra: http://localhost:3000
- ✅ Veja se os posts aparecem
- ✅ Teste o admin: http://localhost:3000/admin
- ✅ Tente criar um post novo

---

## 📍 PASSO 8: Deploy na Vercel

### 1. Configurar variáveis na Vercel:

1. Acesse: https://vercel.com
2. Selecione seu projeto
3. **Settings** → **Environment Variables**
4. Adicione TODAS as variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Para cada uma, marque: **Production**, **Preview**, **Development**

### 2. Fazer deploy:

```bash
git add .
git commit -m "Migração para Supabase - pronto para produção"
git push
```

### 3. Aguardar deploy (2-3 minutos)

✅ **PRONTO! Seu site está no ar!** 🎉

---

## 🆘 Precisa de Ajuda?

- **Erro no SQL?** → Verifique se copiou TODO o conteúdo do arquivo
- **Erro na migração?** → Verifique se as credenciais estão corretas no `.env.local`
- **Site não funciona?** → Verifique se configurou as variáveis na Vercel

---

## 📞 Próximo Passo

**COMECE AGORA:** Abra https://supabase.com e crie sua conta!

Quando terminar cada passo, me avise e eu te ajudo com o próximo! 🚀
