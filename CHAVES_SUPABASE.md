# 🔑 VERIFICAÇÃO DAS CHAVES SUPABASE

## ❌ Erro Atual
```
Invalid API key
```

## ✅ Chaves Corretas

Copie EXATAMENTE estas chaves (sem espaços antes ou depois):

### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ0MjEsImV4cCI6MjA4MTMxMDQyMX0.HCFtcxOJKzJrPby1XDDdBkMwBx1CPZOLOPkbIyXx_yk
```

### SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTczNDQyMSwiZXhwIjoyMDgxMzEwNDIxfQ.JljL1vqn7oulwWWDKFjc4WH7pL_JsdwE_B4y39geyUA
```

## 🔧 Como Corrigir no Vercel

1. Vá para: https://vercel.com/seu-usuario/cinema-wine-iota/settings/environment-variables

2. **APAGUE** a variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` existente

3. **ADICIONE NOVAMENTE** com o valor correto:
   - Clique em "Add New"
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Cole a chave acima (a linha inteira, sem quebras)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

4. Faça o mesmo para `SUPABASE_SERVICE_ROLE_KEY` se necessário

5. Clique em "Redeploy" no último deployment

## ⚠️ IMPORTANTE
- As chaves NÃO podem ter espaços no início ou fim
- As chaves NÃO podem ter quebras de linha
- Copie a chave INTEIRA de uma vez só
- Cada chave tem 3 partes separadas por pontos (.)

## ✅ Como Verificar
Após fazer redeploy, acesse:
```
https://cinema-wine-iota.vercel.app/api/diagnostics
```

Deve mostrar todas as variáveis como "✅ Configurado"
