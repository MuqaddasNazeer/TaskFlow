const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks'); // ✅ Must come after express

const app = express(); // ✅ Make sure this is before app.use

app.use(cors());
app.use(bodyParser.json());

// ✅ Now it's safe to use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
