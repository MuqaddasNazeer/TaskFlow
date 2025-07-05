const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Route: POST /signup
 * Registers a new user with name, email, and password
 */
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.run(query, [name, email, password], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists or invalid input.' });
    }
    return res.json({ message: 'User registered successfully.', userId: this.lastID });
  });
});

/**
 * Route: POST /login
 * Authenticates user based on email and password
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    return res.json({ message: 'Login successful.', userId: row.id, name: row.name });
  });
});

/**
 * Route: GET /all
 * Returns all registered users (for testing only; not recommended in production)
 */
router.get('/all', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.json(rows);
  });
});

/**
 * Route: GET /ping
 * Health check route to confirm auth routes are working
 */
router.get('/ping', (req, res) => {
  return res.send('Authentication routes are active.');
});

module.exports = router;
