const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express(); 
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend files from 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Only start the server if not in test mode
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// ✅ Export the app for testing
module.exports = app;
