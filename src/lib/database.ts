/**
 * Database Factory
 * 
 * This file exports the database instance based on the DATABASE_TYPE environment variable.
 * It automatically selects between SQLite (local development) and Supabase (production).
 */

import type { DatabaseAdapter, DatabaseType } from './database.types';
import { SQLiteAdapter } from './adapters/sqlite.adapter';
import { SupabaseAdapter } from './adapters/supabase.adapter';

// Determine which database to use
const databaseType: DatabaseType = (process.env.DATABASE_TYPE as DatabaseType) || 'sqlite';

let dbInstance: DatabaseAdapter | null = null;

/**
 * Get or create the database instance (singleton pattern)
 */
function getDatabaseInstance(): DatabaseAdapter {
    if (dbInstance) {
        return dbInstance;
    }

    console.log(`[Database] Initializing ${databaseType.toUpperCase()} adapter...`);

    try {
        if (databaseType === 'supabase') {
            dbInstance = new SupabaseAdapter();
        } else if (databaseType === 'sqlite') {
            dbInstance = new SQLiteAdapter();
        } else {
            throw new Error(
                `Invalid DATABASE_TYPE: ${databaseType}. Must be 'sqlite' or 'supabase'`
            );
        }

        // Initialize the database (create tables, run migrations, etc.)
        // Note: This is async, but we'll handle it in the adapter
        dbInstance.initialize().catch((error) => {
            console.error('[Database] Initialization error:', error);
        });

        console.log(`[Database] ${databaseType.toUpperCase()} adapter initialized successfully`);

        return dbInstance;
    } catch (error) {
        console.error('[Database] Failed to initialize database:', error);
        throw error;
    }
}

/**
 * Export a getter function instead of direct instance
 * This ensures initialization only happens when actually needed
 */
export const db = new Proxy({} as DatabaseAdapter, {
    get(target, prop) {
        const instance = getDatabaseInstance();
        return instance[prop as keyof DatabaseAdapter];
    }
});

/**
 * Export the database type for conditional logic if needed
 */
export const currentDatabaseType = databaseType;

/**
 * Helper function to check if using Supabase
 */
export const isUsingSupabase = () => databaseType === 'supabase';

/**
 * Helper function to check if using SQLite
 */
export const isUsingSQLite = () => databaseType === 'sqlite';
