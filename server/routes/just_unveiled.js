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
        cb(null, 'just-unveiled-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

async function ensureTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS home_just_unveiled (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            image_url TEXT,
            order_index INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    // Seed default cards if empty
    const [rows] = await db.query('SELECT COUNT(*) as count FROM home_just_unveiled');
    if (rows[0].count === 0) {
        await db.query(`
            INSERT INTO home_just_unveiled (title, subtitle, image_url, order_index) VALUES 
            ('Sapphire Cushion Ring', '$4,800', 'https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 1),
            ('Sapphire Cushion Pendant', '$5,200', 'https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 2),
            ('Sapphire Cushion Earrings', '$5,950', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 3)
        `);
    }
}

// GET all just unveiled items
router.get('/', async (req, res) => {
    try {
        await ensureTable();
        const [rows] = await db.query('SELECT * FROM home_just_unveiled ORDER BY order_index ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new just unveiled item
router.post('/', upload.single('image'), async (req, res) => {
    const { title, subtitle, order_index } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await ensureTable();

        // Enforce the 3 cards limit on POST
        const [countRows] = await db.query('SELECT COUNT(*) as count FROM home_just_unveiled');
        if (countRows[0].count >= 3) {
            return res.status(400).json({ message: 'Maximum of 3 cards allowed in Just Unveiled.' });
        }

        const [result] = await db.query(
            'INSERT INTO home_just_unveiled (title, subtitle, image_url, order_index) VALUES (?, ?, ?, ?)',
            [title, subtitle, image_url, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Just Unveiled item created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update just unveiled item
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, order_index } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        await ensureTable();
        await db.query(
            'UPDATE home_just_unveiled SET title = ?, subtitle = ?, image_url = ?, order_index = ? WHERE id = ?',
            [title, subtitle, image_url, order_index || 0, id]
        );
        res.json({ message: 'Just Unveiled item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE just unveiled item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await ensureTable();
        await db.query('DELETE FROM home_just_unveiled WHERE id = ?', [id]);
        res.json({ message: 'Just Unveiled item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
