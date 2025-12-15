# Configuração do Banco de Dados - CinemaSite

Este projeto suporta dois tipos de banco de dados através de uma camada de abstração:

- **SQLite** - Para desenvolvimento local
- **Supabase (PostgreSQL)** - Para produção

## Configuração Rápida

### 1. Escolher o Banco de Dados

Edite o arquivo `.env` e defina a variável `DATABASE_TYPE`:

```bash
# Para desenvolvimento local com SQLite
DATABASE_TYPE=sqlite

# Para produção com Supabase
DATABASE_TYPE=supabase
```

### 2. Configuração SQLite (Desenvolvimento Local)

**Vantagens:**
- Sem necessidade de configuração externa
- Rápido para desenvolvimento
- Arquivo local `cinema.db`

**Passos:**

1. Configure o `.env`:
   ```bash
   DATABASE_TYPE=sqlite
   ```

2. Execute o setup:
   ```bash
   npm run setup:db
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```

O arquivo `cinema.db` será criado automaticamente na raiz do projeto.

### 3. Configuração Supabase (Produção)

**Vantagens:**
- Banco de dados PostgreSQL gerenciado
- Escalável para produção
- Storage integrado para uploads
- Backups automáticos

**Passos:**

1. Crie uma conta no [Supabase](https://supabase.com)

2. Crie um novo projeto

3. Obtenha as credenciais em: `Project Settings > API`

4. Configure o `.env`:
   ```bash
   DATABASE_TYPE=supabase
   
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

5. Execute o schema SQL:
   - Acesse o Supabase Dashboard
   - Vá em `SQL Editor`
   - Execute o conteúdo de `scripts/supabase-schema.sql`

6. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Migração de Dados

### SQLite → Supabase

Para migrar dados existentes do SQLite para o Supabase:

```bash
npm run migrate:to-supabase
```

Este script irá:
1. Ler todos os dados do SQLite
2. Criar as tabelas no Supabase (se necessário)
3. Inserir todos os dados no Supabase
4. Migrar imagens para o Supabase Storage

## Estrutura do Código

### Arquivos Principais

```
src/lib/
├── database.types.ts          # Interfaces TypeScript
├── database.ts                # Factory principal
└── adapters/
    ├── sqlite.adapter.ts      # Implementação SQLite
    └── supabase.adapter.ts    # Implementação Supabase
```

### Como Usar no Código

```typescript
import { db } from '@/lib/database';

// Todos os métodos são assíncronos
const posts = await db.posts.getAll();
const post = await db.posts.getById(1);
await db.posts.create({ title: 'Novo Post', ... });
await db.posts.update(1, { title: 'Título Atualizado' });
await db.posts.delete(1);
```

### Operações Disponíveis

#### Posts
- `getAll()` - Todos os posts
- `getPublished()` - Posts publicados
- `getBySlug(slug)` - Post por slug
- `getById(id)` - Post por ID
- `getByCategory(category)` - Posts por categoria
- `create(post)` - Criar post
- `update(id, post)` - Atualizar post
- `delete(id)` - Deletar post

#### Banners
- `getAll()` - Todos os banners
- `getActive()` - Banners ativos
- `getById(id)` - Banner por ID
- `create(banner)` - Criar banner
- `update(id, banner)` - Atualizar banner
- `delete(id)` - Deletar banner

#### Activities
- `getAll()` - Todas as atividades
- `getActive()` - Atividades ativas
- `getById(id)` - Atividade por ID
- `create(activity)` - Criar atividade
- `update(id, activity)` - Atualizar atividade
- `delete(id)` - Deletar atividade

#### Users
- `findByUsername(username)` - Buscar usuário
- `create(username, passwordHash)` - Criar usuário
- `getAll()` - Todos os usuários

## Troubleshooting

### Erro: "Missing Supabase credentials"

Certifique-se de que as variáveis de ambiente estão configuradas corretamente no `.env`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Erro: "Cannot find module 'better-sqlite3'"

Execute:
```bash
npm install
```

### Banco de dados não inicializa

1. Verifique se `DATABASE_TYPE` está definido corretamente
2. Para SQLite: verifique permissões de escrita na pasta do projeto
3. Para Supabase: verifique se as credenciais estão corretas

### Dados não aparecem após migração

1. Verifique se o schema foi executado no Supabase
2. Verifique os logs do console para erros
3. Confirme que `DATABASE_TYPE=supabase` está configurado

## Deploy

### Vercel com Supabase

1. Configure as variáveis de ambiente no Vercel:
   - `DATABASE_TYPE=supabase`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

2. Deploy normalmente:
   ```bash
   vercel --prod
   ```

### Desenvolvimento Local

Use SQLite para desenvolvimento:
```bash
DATABASE_TYPE=sqlite npm run dev
```

## Notas Importantes

1. **Nunca commite o arquivo `.env`** - Use `.env.example` como template
2. **SQLite não é recomendado para produção** - Use Supabase
3. **Backups** - Para SQLite, faça backup do arquivo `cinema.db`. Para Supabase, use os backups automáticos
4. **Performance** - Supabase oferece melhor performance para múltiplos usuários simultâneos
