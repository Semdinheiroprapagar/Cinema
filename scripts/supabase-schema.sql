-- Schema para o CinemaSite no Supabase (PostgreSQL)

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT NOT NULL,
  content_type TEXT DEFAULT 'post',
  video_url TEXT,
  media_files TEXT,
  rating INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title TEXT,
  image_url TEXT,
  video_url TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_activities_active ON activities(active);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (todos podem ler, apenas autenticados podem escrever)
-- Posts: leitura pública, escrita autenticada
CREATE POLICY "Posts são públicos para leitura"
  ON posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Posts podem ser criados por autenticados"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Posts podem ser atualizados por autenticados"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Posts podem ser deletados por autenticados"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Banners: leitura pública, escrita autenticada
CREATE POLICY "Banners são públicos para leitura"
  ON banners FOR SELECT
  USING (true);

CREATE POLICY "Banners podem ser gerenciados por autenticados"
  ON banners FOR ALL
  USING (auth.role() = 'authenticated');

-- Activities: leitura pública, escrita autenticada
CREATE POLICY "Activities são públicas para leitura"
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "Activities podem ser gerenciadas por autenticados"
  ON activities FOR ALL
  USING (auth.role() = 'authenticated');

-- Users: apenas autenticados podem acessar
CREATE POLICY "Users podem ser acessados por autenticados"
  ON users FOR ALL
  USING (auth.role() = 'authenticated');

-- Storage bucket para uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage (permitir upload e leitura pública)
CREATE POLICY "Uploads são públicos para leitura"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Uploads podem ser feitos por autenticados"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Uploads podem ser deletados por autenticados"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
