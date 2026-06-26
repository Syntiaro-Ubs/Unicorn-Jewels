const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const normalizeEmail = (value = '') => value.trim().toLowerCase();
const isBcryptHash = (value = '') => /^\$2[aby]\$\d{2}\$/.test(value);

// Admin Login
router.post('/login', async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password || '';

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE LOWER(email) = ?', [email]);
        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                permissions: admin.permissions ? JSON.parse(admin.permissions) : []
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Signup
router.post('/signup', async (req, res) => {
    const firstName = req.body?.firstName?.trim() || '';
    const lastName = req.body?.lastName?.trim() || '';
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password || '';

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
router.post('/user-login', async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password || '';

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const storedPassword = user.password || '';
        const isMatch = isBcryptHash(storedPassword)
            ? await bcrypt.compare(password, storedPassword)
            : password === storedPassword;

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!isBcryptHash(storedPassword)) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Profile
router.put('/update-profile', async (req, res) => {
    const { userId, firstName, lastName, email, phone } = req.body;
    try {
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
            [firstName, lastName, email, phone, userId]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Orders
router.get('/user-orders/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM user_orders WHERE user_id = ? AND status NOT IN ("Pending Payment", "Failed", "FAILED") ORDER BY order_date DESC',
            [req.params.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create User Order
router.post('/user-orders', async (req, res) => {
    const { userId, orderId, productName, price, imageUrl, status, productId, quantity, selectedSize, selectedWeight } = req.body;
    try {
        const orderStatus = status || 'Processing';
        const prodId = productId || null;
        const qty = quantity || 1;
        const sz = selectedSize || null;
        const wt = selectedWeight || null;
        await db.query(
            'INSERT INTO user_orders (user_id, order_id, product_name, price, image_url, status, product_id, quantity, selected_size, selected_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, orderId, productName, price, imageUrl, orderStatus, prodId, qty, sz, wt]
        );
        res.status(201).json({ message: 'Order created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Addresses
router.get('/user-addresses/:userId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_addresses WHERE user_id = ?', [req.params.userId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create User Address
router.post('/user-addresses', async (req, res) => {
    const { userId, type, isPrimary, street, apartment, city, state, zip, country } = req.body;
    try {
        // If this is primary, unset other primaries for this user
        if (isPrimary) {
            await db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId]);
        }
        
        const [result] = await db.query(
            'INSERT INTO user_addresses (user_id, type, is_primary, street, apartment, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, type, isPrimary, street, apartment, city, state, zip, country]
        );
        res.status(201).json({ message: 'Address created', addressId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Address
router.put('/user-addresses/:addressId', async (req, res) => {
    const { type, isPrimary, street, apartment, city, state, zip, country, userId } = req.body;
    try {
        if (isPrimary) {
            await db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId]);
        }
        await db.query(
            'UPDATE user_addresses SET type = ?, is_primary = ?, street = ?, apartment = ?, city = ?, state = ?, zip = ?, country = ? WHERE id = ?',
            [type, isPrimary, street, apartment, city, state, zip, country, req.params.addressId]
        );
        res.json({ message: 'Address updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete User Address
router.delete('/user-addresses/:addressId', async (req, res) => {
    try {
        await db.query('DELETE FROM user_addresses WHERE id = ?', [req.params.addressId]);
        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
