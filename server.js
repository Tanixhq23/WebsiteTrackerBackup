// server.js
require('dotenv').config(); // Load environment variables FIRST

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Now, safely import from config.js after dotenv has run
const { port, greenWebAPI, mongoURI } = require('./config/config');
const auditRoutes = require('./routes/auditRoutes');

// --- Debugging: Check if mongoURI is loaded ---
console.log('DEBUG: mongoURI from config:', mongoURI);
if (!mongoURI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in your .env file or config.js');
    process.exit(1); // Exit the process if URI is missing
}
// ---------------------------------------------


// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message)); // Log only the message for clarity

// ----------------------------------------------------
// IMPORTANT: CORS Configuration - MODIFIED HERE
app.use(cors({
    origin: 'https://websitetrackerfrontend.onrender.com', // <--- Your FRONTEND URL here!
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// ----------------------------------------------------

app.use(express.json());

// Serve static files from the 'public' directory
// IMPORTANT: If your frontend is deployed separately, this line still serves these files
// if someone directly accesses your backend URL with a path like /index.html.
// Your main frontend access will now be via https://websitetrackerfrontend.onrender.com/.
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', auditRoutes);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});