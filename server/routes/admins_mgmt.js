const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Get all admins
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, permissions, created_at FROM admins ORDER BY created_at DESC');
        const admins = rows.map(admin => ({
            ...admin,
            permissions: admin.permissions ? JSON.parse(admin.permissions) : []
        }));
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new admin
router.post('/', async (req, res) => {
    const { username, email, password, permissions } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM admins WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const permsJson = JSON.stringify(permissions || []);
        const [result] = await db.query(
            'INSERT INTO admins (username, email, password, permissions) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, permsJson]
        );
        res.status(201).json({ id: result.insertId, username, email, permissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update admin
router.put('/:adminId', async (req, res) => {
    const { username, email, password, permissions } = req.body;
    try {
        const permsJson = JSON.stringify(permissions || []);
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE admins SET username = ?, email = ?, password = ?, permissions = ? WHERE id = ?',
                [username, email, hashedPassword, permsJson, req.params.adminId]
            );
        } else {
            await db.query(
                'UPDATE admins SET username = ?, email = ?, permissions = ? WHERE id = ?',
                [username, email, permsJson, req.params.adminId]
            );
        }
        res.json({ message: 'Admin updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete admin
router.delete('/:adminId', async (req, res) => {
    try {
        await db.query('DELETE FROM admins WHERE id = ?', [req.params.adminId]);
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
