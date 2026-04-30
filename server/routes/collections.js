const express = require('express');
const router = express.Router();
const db = require('../db');

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
router.post('/', async (req, res) => {
    const { name, slug, description, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO collections (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
            [name, slug, description, image_url]
        );
        res.status(201).json({ id: result.insertId, name, slug, description, image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
