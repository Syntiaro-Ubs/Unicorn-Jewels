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
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all banners
router.get('/banners', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM banner_content ORDER BY updated_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET banner for a specific page
router.get('/banner/:pageKey', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM banner_content WHERE page_key = ?', [req.params.pageKey]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE or UPDATE banner content
router.put('/banner/:pageKey', upload.single('image'), async (req, res) => {
    const { pageKey } = req.params;
    const { title, subtitle, description } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
        const [rows] = await db.query('SELECT id FROM banner_content WHERE page_key = ?', [pageKey]);
        
        if (rows.length > 0) {
            // Update
            await db.query(
                'UPDATE banner_content SET title = ?, subtitle = ?, description = ?, image_url = ? WHERE page_key = ?',
                [title, subtitle, description, imageUrl, pageKey]
            );
            res.json({ message: 'Banner updated successfully', imageUrl });
        } else {
            // Create
            await db.query(
                'INSERT INTO banner_content (page_key, title, subtitle, description, image_url) VALUES (?, ?, ?, ?, ?)',
                [pageKey, title, subtitle, description, imageUrl]
            );
            res.json({ message: 'Banner created successfully', imageUrl });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE banner content
router.delete('/banner/:pageKey', async (req, res) => {
    try {
        await db.query('DELETE FROM banner_content WHERE page_key = ?', [req.params.pageKey]);
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
