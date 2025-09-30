require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/upload', require('./routes/upload'));



// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Civil Path Study API is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});