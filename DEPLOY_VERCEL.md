# 🚀 Guia de Deploy no Vercel - Meio Amargo

Este guia mostra como fazer o deploy do seu site de cinema na Vercel.

---

## 📋 Pré-requisitos

- ✅ Conta no GitHub (gratuita)
- ✅ Conta na Vercel (gratuita) - [vercel.com](https://vercel.com)

---

## 🎯 Método 1: Via GitHub (Recomendado)

### Passo 1: Fazer Commit das Alterações

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Preparando para deploy - Menu hamburger responsivo adicionado"
```

### Passo 2: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure:
   - **Repository name**: `meio-amargo-cinema` (ou o nome que preferir)
   - **Description**: "Site de críticas de cinema e séries - Meio Amargo"
   - **Visibility**: Public ou Private (sua escolha)
   - ⚠️ **NÃO** marque "Initialize with README" (você já tem um projeto)
5. Clique em **"Create repository"**

### Passo 3: Conectar seu Projeto ao GitHub

Copie os comandos que o GitHub mostra e execute no terminal:

```bash
# Exemplo (substitua SEU_USUARIO pelo seu usuário do GitHub):
git remote add origin https://github.com/SEU_USUARIO/meio-amargo-cinema.git
git branch -M main
git push -u origin main
```

### Passo 4: Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Após o login, clique em **"Add New..."** → **"Project"**
5. Você verá uma lista dos seus repositórios do GitHub
6. Encontre **"meio-amargo-cinema"** e clique em **"Import"**
7. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run build` (já preenchido)
   - **Output Directory**: `.next` (já preenchido)
8. Clique em **"Deploy"**

### Passo 5: Aguarde o Deploy

- A Vercel vai automaticamente:
  - ✅ Instalar as dependências (`npm install`)
  - ✅ Fazer o build do projeto (`npm run build`)
  - ✅ Publicar o site
- Em 1-3 minutos, seu site estará no ar! 🎉

### Passo 6: Acessar seu Site

Após o deploy, você receberá uma URL como:
```
https://meio-amargo-cinema.vercel.app
```

---

## 🎯 Método 2: Via Vercel CLI (Mais Rápido)

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login na Vercel

```bash
vercel login
```

Escolha a opção de login (GitHub, GitLab, Bitbucket ou Email).

### Passo 3: Deploy

```bash
# Na pasta do projeto
cd /Users/guilhermesousa/Desktop/CinemaSite

# Deploy
vercel
```

Responda as perguntas:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `meio-amargo-cinema`
- **In which directory is your code located?** → `./` (pressione Enter)
- **Want to override the settings?** → `N` (No)

### Passo 4: Deploy em Produção

Após testar, faça o deploy de produção:

```bash
vercel --prod
```

---

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

Se você usar variáveis de ambiente (`.env`), adicione-as na Vercel:

1. No dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Adicione cada variável:
   - **Key**: Nome da variável (ex: `DATABASE_URL`)
   - **Value**: Valor da variável
   - **Environment**: Production, Preview, Development

### Domínio Personalizado

Para usar seu próprio domínio:

1. Vá em **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `meioamargo.com`)
4. Siga as instruções para configurar o DNS

---

## 🔄 Deploys Automáticos

Após conectar ao GitHub, **cada push** para a branch `main` fará um deploy automático!

```bash
# Fazer alterações
git add .
git commit -m "Descrição das alterações"
git push

# A Vercel vai automaticamente fazer o deploy! 🚀
```

---

## ⚠️ Considerações Importantes

### Banco de Dados SQLite

⚠️ **IMPORTANTE**: O SQLite (`cinema.db`) **NÃO funciona** na Vercel porque:
- A Vercel usa um sistema de arquivos read-only
- Cada deploy recria o ambiente

**Soluções:**

1. **Usar Vercel Postgres** (Recomendado):
   - Gratuito até 256MB
   - Integração nativa com Vercel
   - [Documentação](https://vercel.com/docs/storage/vercel-postgres)

2. **Usar Turso** (SQLite na nuvem):
   - Gratuito até 500 databases
   - Compatível com SQLite
   - [turso.tech](https://turso.tech)

3. **Usar Supabase**:
   - PostgreSQL gratuito
   - Inclui autenticação e storage
   - [supabase.com](https://supabase.com)

### Uploads de Imagens

As imagens em `/public/uploads` também não persistem. Use:
- **Vercel Blob Storage**
- **Cloudinary**
- **AWS S3**
- **Supabase Storage**

---

## 🆘 Problemas Comuns

### Erro de Build

Se o build falhar:
1. Verifique os logs no dashboard da Vercel
2. Teste o build localmente: `npm run build`
3. Corrija os erros e faça push novamente

### Erro 404 em Rotas

Se algumas páginas dão 404:
- Certifique-se que está usando o App Router do Next.js corretamente
- Verifique a estrutura de pastas em `src/app/`

### Imagens Não Carregam

Configure o `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    domains: ['seu-dominio.vercel.app'],
  },
}
```

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## ✅ Checklist Final

Antes de fazer o deploy:

- [ ] Código commitado no Git
- [ ] `.gitignore` configurado corretamente
- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente documentadas
- [ ] Plano para migrar do SQLite (se necessário)
- [ ] Plano para storage de imagens (se necessário)

---

**Pronto para o deploy! 🚀**

Qualquer dúvida, consulte a [documentação da Vercel](https://vercel.com/docs) ou peça ajuda!
