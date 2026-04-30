const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const collectionRoutes = require('./routes/collections');
const editorialsRoutes = require('./routes/editorials');
const diamondEditRoutes = require('./routes/diamond_edit');
const serviceRoutes = require('./routes/services');
const instagramRouter = require('./routes/instagram');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/editorials', editorialsRoutes);
app.use('/api/diamond-edit', diamondEditRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/instagram', instagramRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
