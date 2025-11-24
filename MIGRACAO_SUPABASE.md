# 🚀 Guia de Migração para Supabase

Este guia mostra como migrar o CinemaSite do SQLite local para Supabase (PostgreSQL na nuvem).

---

## 📋 Passo 1: Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)
4. Clique em **"New Project"**
5. Configure:
   - **Name**: `cinema-site` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: `South America (São Paulo)` (mais próximo do Brasil)
   - **Pricing Plan**: Free (gratuito)
6. Clique em **"Create new project"**
7. Aguarde 2-3 minutos enquanto o projeto é criado

---

## 📋 Passo 2: Obter Credenciais

Após criar o projeto:

1. No dashboard do Supabase, vá em **Settings** (⚙️) → **API**
2. Anote as seguintes informações:

```
Project URL: https://[seu-projeto].supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (mantenha em segredo!)
```

3. Vá em **Settings** → **Database**
4. Role até **Connection string** → **URI**
5. Copie a connection string (substitua [YOUR-PASSWORD] pela senha que você criou)

```
postgresql://postgres:[YOUR-PASSWORD]@db.[seu-projeto].supabase.co:5432/postgres
```

---

## 📋 Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[seu-projeto].supabase.co:5432/postgres

# JWT Secret (para autenticação)
JWT_SECRET=seu-secret-key-super-seguro-aqui
```

⚠️ **IMPORTANTE**: Adicione `.env.local` ao `.gitignore` para não commitar as credenciais!

---

## 📋 Passo 4: Aguarde a Migração Automática

O assistente vai:
1. ✅ Instalar as dependências do Supabase
2. ✅ Criar as tabelas no PostgreSQL
3. ✅ Migrar os dados do SQLite para Supabase
4. ✅ Atualizar o código para usar Supabase
5. ✅ Configurar o storage de imagens

---

## 📋 Passo 5: Testar Localmente

Após a migração, teste:

```bash
npm run dev
```

Acesse:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 📋 Passo 6: Deploy na Vercel

1. Vá no dashboard da Vercel
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Faça um novo deploy:
   ```bash
   git add .
   git commit -m "Migração para Supabase"
   git push
   ```

---

## ✅ Vantagens do Supabase

- ✅ **Banco de dados PostgreSQL** na nuvem (gratuito até 500MB)
- ✅ **Storage de arquivos** (gratuito até 1GB)
- ✅ **Autenticação** integrada (se quiser usar no futuro)
- ✅ **API automática** para o banco de dados
- ✅ **Backups automáticos**
- ✅ **Dashboard visual** para gerenciar dados

---

## 🆘 Problemas Comuns

### Erro de conexão com o banco
- Verifique se a senha está correta na connection string
- Verifique se o projeto Supabase está ativo

### Imagens não carregam
- Verifique as políticas de storage no Supabase
- As políticas serão configuradas automaticamente

---

**Pronto! Agora é só seguir os passos acima e aguardar a migração automática! 🚀**
