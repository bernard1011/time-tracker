import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'prisma', 'dev.db');

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Project (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS TimeEntry (
    id TEXT PRIMARY KEY,
    taskName TEXT NOT NULL,
    projectId TEXT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    duration INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_time_entry_project ON TimeEntry(projectId);
  CREATE INDEX IF NOT EXISTS idx_time_entry_start ON TimeEntry(startTime);
`);

// Insert default projects if none exist
const projectCount = db.prepare('SELECT COUNT(*) as count FROM Project').get();
if (projectCount.count === 0) {
  const insertProject = db.prepare('INSERT INTO Project (id, name, color) VALUES (?, ?, ?)');
  insertProject.run('proj_1', 'Development', '#3B82F6');
  insertProject.run('proj_2', 'Design', '#8B5CF6');
  insertProject.run('proj_3', 'Marketing', '#10B981');
  insertProject.run('proj_4', 'Meetings', '#F59E0B');
  console.log('Created default projects');
}

console.log('Database initialized successfully at:', dbPath);
db.close();
