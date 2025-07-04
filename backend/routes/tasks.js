const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Task
router.post('/create', (req, res) => {
  const { userId, title, category, deadline, time } = req.body;

  db.run(
    `INSERT INTO tasks (user_id, title, category, deadline, time, completed) VALUES (?, ?, ?, ?, ?, 0)`,
  [userId, title, category, deadline, time],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Task added', taskId: this.lastID });
    }
  );
});

// Get Tasks for a User
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update Task
router.put('/update/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, category, deadline, completed } = req.body;

  db.run(
    `UPDATE tasks SET title = ?, category = ?, deadline = ?, completed = ? WHERE id = ?`,
    [title, category, deadline, completed, taskId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Task updated' });
    }
  );
});

// Delete Task
router.delete('/delete/:id', (req, res) => {
  const taskId = req.params.id;

  db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task deleted' });
  });
});
// Mark Task as Completed
router.put('/complete/:id', (req, res) => {
  const taskId = req.params.id;

  db.run(
    `UPDATE tasks SET completed = 1 WHERE id = ?`,
    [taskId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Task marked as completed' });
    }
  );
});

module.exports = router;
