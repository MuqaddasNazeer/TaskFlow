const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Route: POST /create
 * Description: Creates a new task for the authenticated user
 */
router.post('/create', (req, res) => {
  const { userId, title, category, deadline, time } = req.body;

  const query = `
    INSERT INTO tasks (user_id, title, category, deadline, time, completed)
    VALUES (?, ?, ?, ?, ?, 0)
  `;

  db.run(query, [userId, title, category, deadline, time], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Task added successfully.', taskId: this.lastID });
  });
});

/**
 * Route: GET /user/:userId
 * Description: Fetches all tasks for a specific user
 */
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `SELECT * FROM tasks WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
});

/**
 * Route: PUT /update/:id
 * Description: Updates an existing task by ID
 */
router.put('/update/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, category, deadline, time, completed = 0 } = req.body;

  const query = `
    UPDATE tasks
    SET title = ?, category = ?, deadline = ?, time = ?, completed = ?
    WHERE id = ?
  `;

  db.run(query, [title, category, deadline, time, completed, taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Task updated successfully.' });
  });
});

/**
 * Route: DELETE /delete/:id
 * Description: Deletes a task by ID
 */
router.delete('/delete/:id', (req, res) => {
  const taskId = req.params.id;

  const query = `DELETE FROM tasks WHERE id = ?`;

  db.run(query, [taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Task deleted successfully.' });
  });
});

/**
 * Route: PUT /complete/:id
 * Description: Marks a task as completed by ID
 */
router.put('/complete/:id', (req, res) => {
  const taskId = req.params.id;

  const query = `UPDATE tasks SET completed = 1 WHERE id = ?`;

  db.run(query, [taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Task marked as completed.' });
  });
});

module.exports = router;
