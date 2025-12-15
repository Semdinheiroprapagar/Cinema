# Configurar Variáveis de Ambiente no Vercel

## 🔴 Erro 500 - Causa
O site está com erro 500 porque as variáveis de ambiente do Supabase não estão configuradas no Vercel.

## ✅ Solução - Adicionar Variáveis no Vercel

### Passo 1: Acessar Configurações
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Ou: Dashboard do projeto → Settings → Environment Variables

### Passo 2: Adicionar as Variáveis

Adicione cada uma dessas variáveis:

**DATABASE_TYPE**
- Value: `supabase`

**NEXT_PUBLIC_SUPABASE_URL**
- Value: `https://ygxsmellzuitjlenvcig.supabase.co`

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ0MjEsImV4cCI6MjA4MTMxMDQyMX0.HCFtcxOJKzJrPby1XDDdBkMwBx1CPZOLOPkbIyXx_yk`

**SUPABASE_SERVICE_ROLE_KEY**
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTczNDQyMSwiZXhwIjoyMDgxMzEwNDIxfQ.JljL1vqn7oulwWWDKFjc4WH7pL_JsdwE_B4y39geyUA`

**JWT_SECRET**
- Value: `yoDxaV8OLBaEVIhefV/2We3B/53FMp8He42flhae/QkZLqxatkK9D3v9aeYgKa8SsttV7F0q4rSuqalSukc4rw==`

### Passo 3: Aplicar a Todos os Ambientes
- Marque: Production, Preview, Development

### Passo 4: Redeploy
Após salvar, clique em "Redeploy" no último deployment.

## ✅ Resultado Esperado
Após configurar e fazer redeploy, o site deve funcionar normalmente sem erro 500.
