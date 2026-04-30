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
        cb(null, 'editorial-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all editorials
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM home_editorials ORDER BY order_index ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new editorial
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description, button_text, button_link, is_reversed, order_index } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO home_editorials (title, description, image_url, button_text, button_link, is_reversed, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, image_url, button_text || 'DISCOVER MORE', button_link, is_reversed === 'true' || is_reversed === true, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Editorial created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update editorial
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description, button_text, button_link, is_reversed, order_index } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE home_editorials SET title = ?, description = ?, image_url = ?, button_text = ?, button_link = ?, is_reversed = ?, order_index = ? WHERE id = ?',
            [title, description, image_url, button_text || 'DISCOVER MORE', button_link, is_reversed === 'true' || is_reversed === true, order_index || 0, id]
        );
        res.json({ message: 'Editorial updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE editorial
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM home_editorials WHERE id = ?', [id]);
        res.json({ message: 'Editorial deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
