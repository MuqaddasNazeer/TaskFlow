const express = require('express');
const router = express.Router();
const db = require('../db');

// Signup route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.json({ message: 'User registered', userId: this.lastID });
    }
  );
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ message: 'Login successful', userId: row.id, name: row.name });
    }
  );
});

module.exports = router;
