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
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name, coll.name as collection_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN collections coll ON p.collection_id = coll.id
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new product
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hover_image', maxCount: 1 }]), async (req, res) => {
    const { name, slug, price, price_num, description, category_id, collection_id, metal, tag, is_featured, is_new_arrival } = req.body;
    let image_url = req.body.image_url || '';
    let hover_image_url = req.body.hover_image_url || '';

    if (req.files && req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files && req.files['hover_image'] && req.files['hover_image'][0]) {
        hover_image_url = `/uploads/${req.files['hover_image'][0].filename}`;
    }

    try {
        const [result] = await db.query(
            `INSERT INTO products (name, slug, price, price_num, description, image_url, hover_image_url, category_id, collection_id, metal, tag, is_featured, is_new_arrival) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, price, price_num, description, image_url, hover_image_url, category_id || null, collection_id || null, metal, tag, is_featured === 'true', is_new_arrival === 'true']
        );
        res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update product
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hover_image', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { name, slug, price, price_num, description, category_id, collection_id, metal, tag, is_featured, is_new_arrival } = req.body;
    let image_url = req.body.image_url;
    let hover_image_url = req.body.hover_image_url;

    if (req.files && req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files && req.files['hover_image'] && req.files['hover_image'][0]) {
        hover_image_url = `/uploads/${req.files['hover_image'][0].filename}`;
    }

    try {
        await db.query(
            `UPDATE products SET name = ?, slug = ?, price = ?, price_num = ?, description = ?, image_url = ?, hover_image_url = ?, category_id = ?, collection_id = ?, metal = ?, tag = ?, is_featured = ?, is_new_arrival = ? 
             WHERE id = ?`,
            [name, slug, price, price_num, description, image_url, hover_image_url, category_id || null, collection_id || null, metal, tag, is_featured === 'true', is_new_arrival === 'true', id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle is_new_arrival status
router.put('/:id/toggle-new-arrival', async (req, res) => {
    try {
        const { is_new_arrival } = req.body;
        await db.query('UPDATE products SET is_new_arrival = ? WHERE id = ?', [is_new_arrival ? 1 : 0, req.params.id]);
        res.json({ message: 'Product slider status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle is_featured status
router.put('/:id/toggle-featured', async (req, res) => {
    try {
        const { is_featured } = req.body;
        await db.query('UPDATE products SET is_featured = ? WHERE id = ?', [is_featured ? 1 : 0, req.params.id]);
        res.json({ message: 'Product featured status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
