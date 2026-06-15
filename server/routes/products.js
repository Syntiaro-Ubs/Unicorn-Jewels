const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

function slugifyProduct(value) {
    const normalized = String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalized || 'product';
}

async function getUniqueProductSlug(rawSlug, name, excludeId = null) {
    const baseSlug = slugifyProduct(rawSlug || name);
    const query = excludeId === null
        ? 'SELECT slug FROM products WHERE slug = ? OR slug LIKE ?'
        : 'SELECT slug FROM products WHERE (slug = ? OR slug LIKE ?) AND id <> ?';
    const params = excludeId === null
        ? [baseSlug, `${baseSlug}-%`]
        : [baseSlug, `${baseSlug}-%`, excludeId];
    const [rows] = await db.query(query, params);
    const existingSlugs = new Set(rows.map(row => row.slug));

    if (!existingSlugs.has(baseSlug)) {
        return baseSlug;
    }

    let suffix = 2;
    while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
        suffix += 1;
    }

    return `${baseSlug}-${suffix}`;
}

function isDuplicateEntryError(error) {
    return error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062);
}

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
        res.status(500).json({ message: 'Server error', error: error.message });
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
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'additionalImages', maxCount: 10 },
    { name: 'additionalVideos', maxCount: 5 }
]), async (req, res) => {
    const { name, slug, price, price_num, description, category_id, collection_id, metal, tag, is_featured, is_new_arrival, stock, barcode, weight } = req.body;
    let image_url = req.body.image_url || '';
    let additional_images = [];
    let additional_videos = [];

    if (req.files && req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files && req.files['additionalImages']) {
        additional_images = req.files['additionalImages'].map(file => `/uploads/${file.filename}`);
    }

    if (req.files && req.files['additionalVideos']) {
        additional_videos = req.files['additionalVideos'].map(file => `/uploads/${file.filename}`);
    }

    try {
        const normalizedSlug = await getUniqueProductSlug(slug, name);
        const [result] = await db.query(
            `INSERT INTO products (name, slug, price, price_num, description, image_url, category_id, collection_id, metal, tag, is_featured, is_new_arrival, stock, barcode, weight, additional_images, additional_videos) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, 
                normalizedSlug, 
                price, 
                price_num, 
                description, 
                image_url, 
                category_id || null, 
                collection_id || null, 
                metal, 
                tag, 
                is_featured === 'true', 
                is_new_arrival === 'true', 
                stock || 0, 
                barcode || '', 
                weight || 0.3,
                JSON.stringify(additional_images),
                JSON.stringify(additional_videos)
            ]
        );
        res.status(201).json({ id: result.insertId, slug: normalizedSlug, message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        if (isDuplicateEntryError(error)) {
            return res.status(409).json({ message: 'A product with that slug already exists. Please try again.' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT update product
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'hover_image', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { name, slug, price, price_num, description, category_id, collection_id, metal, tag, is_featured, is_new_arrival, stock, barcode, weight } = req.body;
    let image_url = req.body.image_url;
    let hover_image_url = req.body.hover_image_url;

    if (req.files && req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files && req.files['hover_image'] && req.files['hover_image'][0]) {
        hover_image_url = `/uploads/${req.files['hover_image'][0].filename}`;
    }

    try {
        const normalizedSlug = await getUniqueProductSlug(slug, name, id);
        await db.query(
            `UPDATE products SET name = ?, slug = ?, price = ?, price_num = ?, description = ?, image_url = ?, hover_image_url = ?, category_id = ?, collection_id = ?, metal = ?, tag = ?, is_featured = ?, is_new_arrival = ?, stock = ?, barcode = ?, weight = ? 
             WHERE id = ?`,
            [name, normalizedSlug, price, price_num, description, image_url, hover_image_url, category_id || null, collection_id || null, metal, tag, is_featured === 'true', is_new_arrival === 'true', stock || 0, barcode || '', weight || 0.3, id]
        );
        res.json({ message: 'Product updated successfully', slug: normalizedSlug });
    } catch (error) {
        console.error(error);
        if (isDuplicateEntryError(error)) {
            return res.status(409).json({ message: 'A product with that slug already exists. Please try again.' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
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

// Reduce product stock
router.post('/reduce-stock', async (req, res) => {
    const { items } = req.body; // Expects an array of { id, quantity }
    
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Items array is required' });
    }

    try {
        for (const item of items) {
            const numericId = parseInt(item.id, 10);
            if (!isNaN(numericId) && String(numericId) === String(item.id)) {
                // 1. Reduce main product stock
                await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, numericId]);
                
                // 2. Reduce size variant stock if selectedSize is provided
                if (item.selectedSize) {
                    await db.query(
                        'UPDATE product_variants SET stock = stock - ? WHERE product_id = ? AND size = ?',
                        [item.quantity, numericId, item.selectedSize]
                    );
                }
            } else {
                // Fallback for mock/string products
                await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
            }
        }
        res.json({ message: 'Stock reduced successfully' });
    } catch (error) {
        console.error('Error reducing stock:', error);
        res.status(500).json({ message: 'Server error reducing stock' });
    }
});

// GET variants for a product
router.get('/:id/variants', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM product_variants WHERE product_id = ? ORDER BY size, color', [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching variants:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create variant
router.post('/variants', upload.array('images', 5), async (req, res) => {
    const { product_id, size, color, stock, sku, price, is_active } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
        images = req.files.map(file => `/uploads/${file.filename}`);
    }

    try {
        const [result] = await db.query(
            `INSERT INTO product_variants (product_id, size, color, stock, sku, price, images, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_id, size || '', color || '', stock || 0, sku || '', price || 0, JSON.stringify(images), is_active === '1' || is_active === true ? 1 : 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Variant created successfully' });
    } catch (error) {
        console.error('Error creating variant:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE all variants for a product
router.delete('/:id/variants', async (req, res) => {
    try {
        await db.query('DELETE FROM product_variants WHERE product_id = ?', [req.params.id]);
        res.json({ message: 'Variants deleted successfully' });
    } catch (error) {
        console.error('Error deleting variants:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE single variant
router.delete('/variants/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM product_variants WHERE id = ?', [req.params.id]);
        res.json({ message: 'Variant deleted successfully' });
    } catch (error) {
        console.error('Error deleting variant:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
