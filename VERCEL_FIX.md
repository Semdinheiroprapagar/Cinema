# ⚠️ ERRO NO VERCEL - SOLUÇÃO RÁPIDA

## 🔴 Erro Atual
```
Application error: a server-side exception has occurred
Digest: 485203690
```

## ✅ SOLUÇÃO: Configurar Variáveis de Ambiente

### Passo 1: Acessar Vercel
1. Vá para: https://vercel.com/seu-usuario/cinema-tau-one/settings/environment-variables
2. Ou: Dashboard → Seu Projeto → Settings → Environment Variables

### Passo 2: Adicionar TODAS as 5 variáveis

Clique em "Add New" para cada uma:

#### 1️⃣ DATABASE_TYPE
- **Name**: `DATABASE_TYPE`
- **Value**: `supabase`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 2️⃣ NEXT_PUBLIC_SUPABASE_URL  
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://ygxsmellzuitjlenvcig.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 3️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ0MjEsImV4cCI6MjA4MTMxMDQyMX0.HCFtcxOJKzJrPby1XDDdBkMwBx1CPZOLOPkbIyXx_yk`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 4️⃣ SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTczNDQyMSwiZXhwIjoyMDgxMzEwNDIxfQ.JljL1vqn7oulwWWDKFjc4WH7pL_JsdwE_B4y39geyUA`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 5️⃣ JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: `yoDxaV8OLBaEVIhefV/2We3B/53FMp8He42flhae/QkZLqxatkK9D3v9aeYgKa8SsttV7F0q4rSuqalSukc4rw==`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Passo 3: Redeploy
Após salvar TODAS as variáveis:
1. Vá para: Deployments
2. Clique nos 3 pontinhos (...) do último deployment
3. Clique em "Redeploy"
4. Aguarde o build completar

## ✅ Resultado Esperado
Após o redeploy, o site deve funcionar normalmente sem erros.

## 🆘 Se ainda não funcionar
Me avise e vou investigar os logs do Vercel.
