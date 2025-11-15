const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const canteenRoutes = require('./routes/canteens');
const itemRoutes = require('./routes/items');
const ratingRoutes = require('./routes/ratings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
app.use('/uploads', express.static('uploads'));
