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
        cb(null, 'insta-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all instagram posts
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM home_instagram_posts ORDER BY order_index ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new instagram post
router.post('/', upload.single('image'), async (req, res) => {
    const { post_url, order_index } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO home_instagram_posts (image_url, post_url, order_index) VALUES (?, ?, ?)',
            [image_url, post_url, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Instagram post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update instagram post
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { post_url, order_index } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE home_instagram_posts SET image_url = ?, post_url = ?, order_index = ? WHERE id = ?',
            [image_url, post_url, order_index || 0, id]
        );
        res.json({ message: 'Instagram post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE instagram post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM home_instagram_posts WHERE id = ?', [id]);
        res.json({ message: 'Instagram post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
