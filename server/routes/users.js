const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, phone, created_at FROM users ORDER BY created_at DESC');
        const users = rows.map(u => ({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            phone: u.phone,
            createdAt: u.created_at
        }));
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, phone]
        );
        res.status(201).json({ id: result.insertId, firstName, lastName, email, phone });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/:userId', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, phone = ? WHERE id = ?',
                [firstName, lastName, email, hashedPassword, phone, req.params.userId]
            );
        } else {
            await db.query(
                'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
                [firstName, lastName, email, phone, req.params.userId]
            );
        }
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/:userId', async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.userId]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
