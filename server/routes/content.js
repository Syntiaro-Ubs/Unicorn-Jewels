const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const defaultPageContent = require('../../shared/pageContentDefaults.json');

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

const cloneContent = (value) => JSON.parse(JSON.stringify(value));

async function ensurePageContentTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS page_content (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page_key VARCHAR(100) NOT NULL UNIQUE,
            content_json LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
}

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

// UPLOAD image for structured page content sections
router.post('/page-content-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET structured content for a specific page
router.get('/page-content/:pageKey', async (req, res) => {
    const { pageKey } = req.params;
    const fallbackContent = defaultPageContent[pageKey];

    if (!fallbackContent) {
        return res.status(404).json({ message: 'Page content schema not found' });
    }

    try {
        await ensurePageContentTable();

        const [rows] = await db.query(
            'SELECT content_json FROM page_content WHERE page_key = ?',
            [pageKey]
        );

        if (rows.length === 0) {
            const seededContent = cloneContent(fallbackContent);
            await db.query(
                'INSERT INTO page_content (page_key, content_json) VALUES (?, ?)',
                [pageKey, JSON.stringify(seededContent)]
            );
            return res.json(seededContent);
        }

        return res.json(JSON.parse(rows[0].content_json));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE or UPDATE structured content for a specific page
router.put('/page-content/:pageKey', async (req, res) => {
    const { pageKey } = req.params;
    const fallbackContent = defaultPageContent[pageKey];

    if (!fallbackContent) {
        return res.status(404).json({ message: 'Page content schema not found' });
    }

    try {
        await ensurePageContentTable();

        const content = req.body && Object.keys(req.body).length > 0
            ? req.body
            : cloneContent(fallbackContent);

        await db.query(
            `
                INSERT INTO page_content (page_key, content_json)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)
            `,
            [pageKey, JSON.stringify(content)]
        );

        res.json({ message: 'Page content updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ========== SHOP BY LOOK ENDPOINTS ==========

// GET all shop by look cards
router.get('/shop-by-look', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM shop_by_look ORDER BY display_order ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET specific shop by look card
router.get('/shop-by-look/:variant', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM shop_by_look WHERE variant = ?', [req.params.variant]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shop by look card not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE shop by look card
router.post('/shop-by-look', upload.single('image'), async (req, res) => {
    const { variant, title, description, eyebrow, content_align, image_url } = req.body;
    let imageUrl = image_url;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
        // Get the max display order
        const [maxOrder] = await db.query('SELECT MAX(display_order) as maxOrder FROM shop_by_look');
        const displayOrder = (maxOrder[0]?.maxOrder || 0) + 1;

        await db.query(
            'INSERT INTO shop_by_look (variant, title, description, eyebrow, content_align, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [variant, title, description, eyebrow, content_align, imageUrl, displayOrder]
        );
        res.json({ message: 'Shop by look card created successfully', imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE shop by look card
router.put('/shop-by-look/:variant', upload.single('image'), async (req, res) => {
    const { title, description, eyebrow, content_align, image_url } = req.body;
    let imageUrl = image_url;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
        await db.query(
            'UPDATE shop_by_look SET title = ?, description = ?, eyebrow = ?, content_align = ?, image_url = ? WHERE variant = ?',
            [title, description, eyebrow, content_align, imageUrl, req.params.variant]
        );
        res.json({ message: 'Shop by look card updated successfully', imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE display order (for reordering)
router.put('/shop-by-look-order', async (req, res) => {
    const { items } = req.body; // items = [{ variant, display_order }, ...]

    try {
        for (const item of items) {
            await db.query(
                'UPDATE shop_by_look SET display_order = ? WHERE variant = ?',
                [item.display_order, item.variant]
            );
        }
        res.json({ message: 'Display order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE shop by look card
router.delete('/shop-by-look/:variant', async (req, res) => {
    try {
        await db.query('DELETE FROM shop_by_look WHERE variant = ?', [req.params.variant]);
        res.json({ message: 'Shop by look card deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
