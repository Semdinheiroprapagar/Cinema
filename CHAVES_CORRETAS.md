# 🔑 CHAVES CORRETAS DO SUPABASE

## ❌ PROBLEMA IDENTIFICADO!

Você configurou no Vercel as chaves de um projeto Supabase DIFERENTE!

- **Projeto Local (.env.local)**: `ygxsmellzuitjlenvcig.supabase.co`
- **Projeto no Vercel**: `njakdsfmltbahtkjudhs.supabase.co` ❌ ERRADO!

## ✅ CHAVES CORRETAS PARA O VERCEL

Use ESTAS chaves no Vercel (do projeto `ygxsmellzuitjlenvcig`):

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://ygxsmellzuitjlenvcig.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneHNtZWxsenVpdGpsZW52Y2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTIxMTMsImV4cCI6MjA4MTMyODExM30.XFSmAbk7UTGX3e2WuIM6A4K8Zt0hF2aL_WxRCM6PPzk
```

### 3. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneHNtZWxsenVpdGpsZW52Y2lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc1MjExMywiZXhwIjoyMDgxMzI4MTEzfQ.5577Mpyj5-P9ibMfeDZ8fVrmNuVPdXM568Sg2-PiFys
```

## 🔧 COMO CORRIGIR NO VERCEL

1. Vá para: https://vercel.com/settings/environment-variables

2. **APAGUE** estas 3 variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **ADICIONE NOVAMENTE** com os valores CORRETOS acima

4. **IMPORTANTE**: Marque todos os ambientes (Production, Preview, Development)

5. Faça **Redeploy** do projeto

## ⚠️ ATENÇÃO

As chaves antigas eram do projeto `njakdsfmltbahtkjudhs` (ERRADO)
As chaves corretas são do projeto `ygxsmellzuitjlenvcig` (CORRETO)

Depois de atualizar, o site deve funcionar!
