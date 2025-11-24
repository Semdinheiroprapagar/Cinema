import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'cinema.db');
const db = new Database(dbPath);

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );


  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image_url TEXT,
    video_url TEXT,
    link TEXT,
    active BOOLEAN DEFAULT 1,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    link TEXT,
    active BOOLEAN DEFAULT 1,
    display_order INTEGER DEFAULT 0
  );
`);

// Migrations for existing posts table
try {
  db.exec('ALTER TABLE posts ADD COLUMN rating INTEGER DEFAULT 0');
} catch (error) {
  // Column likely already exists, ignore error
}

try {
  db.exec('ALTER TABLE posts ADD COLUMN content_type TEXT DEFAULT "post"');
} catch (error) {
  // Column likely already exists, ignore error
}

try {
  db.exec('ALTER TABLE posts ADD COLUMN video_url TEXT');
} catch (error) {
  // Column likely already exists, ignore error
}

try {
  db.exec('ALTER TABLE posts ADD COLUMN media_files TEXT');
} catch (error) {
  // Column likely already exists, ignore error
}

// Migrations for banners table
try {
  db.exec('ALTER TABLE banners ADD COLUMN video_url TEXT');
} catch (error) {
  // Column likely already exists, ignore error
}

// Migrations for activities table
try {
  db.exec('ALTER TABLE activities ADD COLUMN video_url TEXT');
} catch (error) {
  // Column likely already exists, ignore error
}

export default db;
