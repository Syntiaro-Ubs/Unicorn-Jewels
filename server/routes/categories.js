const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'category-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new category
router.post('/', upload.single('image'), async (req, res) => {
    const { name, slug } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
            [name, slug, image_url]
        );
        res.status(201).json({ id: result.insertId, name, slug, image_url, message: 'Category created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update category
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
            [name, slug, image_url, id]
        );
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
