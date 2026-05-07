-- Keep this file in sync with the mirror at apps/backend

CREATE TABLE IF NOT EXISTS ballots (
  id TEXT PRIMARY KEY,
  studentIdHash TEXT NOT NULL,
  position TEXT NOT NULL,
  choice TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS ballots_studentIdHash_index ON ballots (studentIdHash);

CREATE TABLE IF NOT EXISTS voters (
  studentId TEXT PRIMARY KEY,
  createdAt TEXT NOT NULL
);
