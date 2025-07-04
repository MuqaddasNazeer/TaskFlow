const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./taskmanager.db');

// Create Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`);

// Create Tasks Table
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  deadline TEXT,
  time TEXT,
  category TEXT,
  completed INTEGER DEFAULT 0,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);


module.exports = db;
