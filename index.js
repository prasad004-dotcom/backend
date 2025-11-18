const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const canteenRoutes = require('./routes/canteens');
const itemRoutes = require('./routes/items');
const ratingRoutes = require('./routes/ratings');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ratings', ratingRoutes);

// Test route
app.get("/", (req, res) => res.json({ ok: true }));

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
