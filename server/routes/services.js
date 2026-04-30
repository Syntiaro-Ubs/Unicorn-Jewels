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
        cb(null, 'service-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all services
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM home_services ORDER BY order_index ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new service
router.post('/', upload.single('image'), async (req, res) => {
    const { tag, title, description, button_text, button_link, is_reversed, order_index } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO home_services (tag, title, description, button_text, button_link, image_url, is_reversed, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tag, title, description, button_text, button_link, image_url, is_reversed === 'true', order_index || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Service created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update service
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { tag, title, description, button_text, button_link, is_reversed, order_index } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE home_services SET tag = ?, title = ?, description = ?, button_text = ?, button_link = ?, image_url = ?, is_reversed = ?, order_index = ? WHERE id = ?',
            [tag, title, description, button_text, button_link, image_url, is_reversed === 'true', order_index || 0, id]
        );
        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE service
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM home_services WHERE id = ?', [id]);
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
