```javascript
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { seedDatabase } from './data/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let database;

export const initializeDatabase = async () => {
  try {
    const dbPath = join(__dirname, '../data/innovation.db');
    
    database = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
    });

    // Enable foreign keys
    await new Promise((resolve, reject) => {
      database.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create tables
    await new Promise((resolve, reject) => {
      database.exec(`
        CREATE TABLE IF NOT EXISTS networks (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS centers (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          network TEXT NOT NULL,
          address TEXT NOT NULL,
          municipality TEXT NOT NULL,
          province TEXT NOT NULL,
          island TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          FOREIGN KEY (network) REFERENCES networks(code)
        );

        CREATE TABLE IF NOT EXISTS departments (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          headTeacher TEXT,
          email TEXT
        );

        CREATE TABLE IF NOT EXISTS families (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS studies (
          id TEXT PRIMARY KEY,
          familyId TEXT NOT NULL,
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          level TEXT NOT NULL,
          FOREIGN KEY (familyId) REFERENCES families(id)
        );

        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          studyId TEXT NOT NULL,
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          shift TEXT NOT NULL,
          year INTEGER NOT NULL,
          FOREIGN KEY (studyId) REFERENCES studies(id)
        );

        CREATE TABLE IF NOT EXISTS academic_years (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          startDate TEXT NOT NULL,
          endDate TEXT NOT NULL,
          isActive INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS quarters (
          id TEXT PRIMARY KEY,
          academicYearId TEXT NOT NULL,
          name TEXT NOT NULL,
          startDate TEXT NOT NULL,
          endDate TEXT NOT NULL,
          isActive INTEGER DEFAULT 0,
          FOREIGN KEY (academicYearId) REFERENCES academic_years(id)
        );

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
          FOREIGN KEY (network) REFERENCES networks(code),
          FOREIGN KEY (center) REFERENCES centers(name),
          FOREIGN KEY (quarter) REFERENCES quarters(id)
        );

        CREATE TABLE IF NOT EXISTS action_departments (
          actionId TEXT NOT NULL,
          departmentCode TEXT NOT NULL,
          PRIMARY KEY (actionId, departmentCode),
          FOREIGN KEY (actionId) REFERENCES actions(id),
          FOREIGN KEY (departmentCode) REFERENCES departments(code)
        );

        CREATE TABLE IF NOT EXISTS action_families (
          actionId TEXT NOT NULL,
          familyCode TEXT NOT NULL,
          PRIMARY KEY (actionId, familyCode),
          FOREIGN KEY (actionId) REFERENCES actions(id),
          FOREIGN KEY (familyCode) REFERENCES families(code)
        );

        CREATE TABLE IF NOT EXISTS action_groups (
          actionId TEXT NOT NULL,
          groupId TEXT NOT NULL,
          PRIMARY KEY (actionId, groupId),
          FOREIGN KEY (actionId) REFERENCES actions(id),
          FOREIGN KEY (groupId) REFERENCES groups(id)
        );
      `, async (err) => {
        if (err) reject(err);
        else {
          // Seed database with initial data
          try {
            await seedDatabase();
            resolve();
          } catch (seedError) {
            reject(seedError);
          }
        }
      });
    });

    console.log('Database initialized successfully');
    return database;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Database interface
export const db = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      database.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },

  exec: (sql) => {
    return new Promise((resolve, reject) => {
      database.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
```