const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.id, o.user_id, o.order_id, o.product_name, o.price, o.image_url, o.status, 
                   o.product_id, o.quantity, o.selected_size, o.order_date,
                   u.email as user_email, u.first_name, u.last_name 
            FROM user_orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.order_date DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE status of all items in an order
router.put('/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        await db.query(
            'UPDATE user_orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
