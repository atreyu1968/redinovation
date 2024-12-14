import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { env } from './env.js';
import { log } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../', env.DB_PATH);

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database operations
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize database schema
export const initializeDatabase = async () => {
  try {
    log.info('Initializing database...');

    // Create users table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        lastName TEXT NOT NULL,
        medusaCode TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        center TEXT,
        network TEXT,
        role TEXT NOT NULL,
        imageUrl TEXT,
        passwordHash TEXT,
        passwordChangeRequired INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create actions table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        studentParticipants INTEGER NOT NULL DEFAULT 0,
        teacherParticipants INTEGER NOT NULL DEFAULT 0,
        rating INTEGER NOT NULL DEFAULT 5,
        comments TEXT,
        createdBy TEXT NOT NULL,
        network TEXT NOT NULL,
        center TEXT NOT NULL,
        quarter TEXT NOT NULL,
        imageUrl TEXT,
        documentUrl TEXT,
        documentName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create networks table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS networks (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create centers table
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS centers (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        network TEXT NOT NULL,
        address TEXT,
        municipality TEXT,
        province TEXT,
        island TEXT,
        phone TEXT,
        email TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    log.info('Database initialized successfully');
  } catch (error) {
    log.error('Error initializing database:', error);
    throw error;
  }
};

export default dbAsync;