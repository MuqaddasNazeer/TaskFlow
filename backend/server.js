const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express(); // ✅ FIX: app initialized BEFORE use()

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend files from 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Server listen
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
