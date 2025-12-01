console.log('server.js is running with Express...');

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use auth routes for /api
app.use('/api', authRoutes);

// Test route to check server working
app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Express server running successfully" });
});


// Connect to MongoDB
connectDB();


// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`);
});

