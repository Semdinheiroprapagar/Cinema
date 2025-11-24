import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), 'cinema.db');
const db = new Database(dbPath);

async function seed() {
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tables if they don't exist
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
      published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const insertUser = db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
    ON CONFLICT(username) DO NOTHING
  `);

    const result = insertUser.run(username, hashedPassword);

    if (result.changes > 0) {
        console.log(`User '${username}' created with password '${password}'`);
    } else {
        console.log(`User '${username}' already exists.`);
    }
}

seed();
