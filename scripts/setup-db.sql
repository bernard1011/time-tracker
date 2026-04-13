-- Create Project table
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create TimeEntry table
CREATE TABLE IF NOT EXISTS TimeEntry (
  id TEXT PRIMARY KEY,
  taskName TEXT NOT NULL,
  projectId TEXT,
  startTime DATETIME NOT NULL,
  endTime DATETIME,
  duration INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_timeentry_projectid ON TimeEntry(projectId);
CREATE INDEX IF NOT EXISTS idx_timeentry_starttime ON TimeEntry(startTime);

-- Insert some default projects
INSERT OR IGNORE INTO Project (id, name, color) VALUES 
  ('default-work', 'Work', '#3B82F6'),
  ('default-personal', 'Personal', '#10B981'),
  ('default-learning', 'Learning', '#8B5CF6');
