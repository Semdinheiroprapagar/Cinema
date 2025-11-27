const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../cinema.db');
const db = new Database(dbPath);

console.log('Starting migration...');

try {
    // Update Artigos -> Listas
    const artigosResult = db.prepare("UPDATE posts SET category = 'Listas' WHERE category = 'Artigos'").run();
    console.log(`Updated ${artigosResult.changes} posts from 'Artigos' to 'Listas'`);

    // Update Temas -> Curiosidades
    const temasResult = db.prepare("UPDATE posts SET category = 'Curiosidades' WHERE category = 'Temas'").run();
    console.log(`Updated ${temasResult.changes} posts from 'Temas' to 'Curiosidades'`);

    console.log('Migration completed successfully.');
} catch (error) {
    console.error('Migration failed:', error);
} finally {
    db.close();
}
