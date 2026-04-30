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
        cb(null, 'diamond-edit-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all diamond edit items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM home_diamond_edit ORDER BY order_index ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new diamond edit item
router.post('/', upload.single('image'), async (req, res) => {
    const { title, subtitle, order_index } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO home_diamond_edit (title, subtitle, image_url, order_index) VALUES (?, ?, ?, ?)',
            [title, subtitle, image_url, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Diamond Edit item created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update diamond edit item
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, order_index } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE home_diamond_edit SET title = ?, subtitle = ?, image_url = ?, order_index = ? WHERE id = ?',
            [title, subtitle, image_url, order_index || 0, id]
        );
        res.json({ message: 'Diamond Edit item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE diamond edit item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM home_diamond_edit WHERE id = ?', [id]);
        res.json({ message: 'Diamond Edit item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
