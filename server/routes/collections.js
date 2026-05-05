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
        cb(null, 'collection-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all collections
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM collections ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new collection
router.post('/', upload.single('image'), async (req, res) => {
    const { name, slug, description } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO collections (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
            [name, slug, description, image_url]
        );
        res.status(201).json({ id: result.insertId, name, slug, description, image_url, message: 'Collection created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update collection
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, slug, description } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE collections SET name = ?, slug = ?, description = ?, image_url = ? WHERE id = ?',
            [name, slug, description, image_url, id]
        );
        res.json({ message: 'Collection updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE collection
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM collections WHERE id = ?', [id]);
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
