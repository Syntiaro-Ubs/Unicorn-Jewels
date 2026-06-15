const express = require('express');
const router = express.Router();
const db = require('../db');
const phonePeService = require('../services/phonepeService');
const emailService = require('../services/emailService');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.id, o.user_id, o.order_id, o.product_name, o.price, o.image_url, o.status, 
                   o.product_id, o.quantity, o.selected_size, o.order_date, o.refund_id, o.refund_status,
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
        // Query the current items and status of this order before updating
        const [currentOrders] = await db.query(
            'SELECT * FROM user_orders WHERE order_id = ?',
            [orderId]
        );

        if (currentOrders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = currentOrders[0].status;

        // If transitioning to 'Cancelled' from a non-cancelled status, replenish stock and update tracking
        if (status === 'Cancelled' && oldStatus !== 'Cancelled' && oldStatus !== 'FAILED' && oldStatus !== 'Failed') {
            for (const item of currentOrders) {
                if (item.product_id) {
                    const numericId = parseInt(item.product_id, 10);
                    if (!isNaN(numericId) && String(numericId) === String(item.product_id)) {
                        // Ensure product exists in DB before updating stock
                        const [dbProd] = await db.query('SELECT id FROM products WHERE id = ?', [numericId]);
                        if (dbProd.length > 0) {
                            // Replenish main product stock
                            await db.query(
                                'UPDATE products SET stock = stock + ? WHERE id = ?',
                                [item.quantity, numericId]
                            );
                            // Replenish size variant stock if specified
                            if (item.selected_size) {
                                await db.query(
                                    'UPDATE product_variants SET stock = stock + ? WHERE product_id = ? AND size = ?',
                                    [item.quantity, numericId, item.selected_size]
                                );
                            }
                            console.log(`Replenished stock by ${item.quantity} (Size: ${item.selected_size || 'None'}) for product ID: ${numericId}`);
                        }
                    }
                }
            }

            // Sync with logistics tracking (FedEx)
            const [trackingRows] = await db.query(
                'SELECT id FROM order_tracking WHERE order_id = ? LIMIT 1',
                [orderId]
            );

            let trackingId;
            if (trackingRows.length > 0) {
                trackingId = trackingRows[0].id;
                await db.query(
                    'UPDATE order_tracking SET status = "Cancelled" WHERE id = ?',
                    [trackingId]
                );
            } else {
                // Generate a mockup FedEx tracking number for the order
                const trackingNum = `449012${Math.floor(100000 + Math.random() * 900000)}`;
                const [insertResult] = await db.query(
                    `INSERT INTO order_tracking (order_id, tracking_number, status, carrier)
                     VALUES (?, ?, 'Cancelled', 'FedEx')`,
                    [orderId, trackingNum]
                );
                trackingId = insertResult.insertId;
            }

            // Insert FedEx cancellation event checkpoint
            await db.query(
                `INSERT INTO order_tracking_events (tracking_id, event_timestamp, location, description, status_code)
                 VALUES (?, NOW(), 'Memphis, TN, US', 'Shipment cancelled by customer', 'CA')`,
                [trackingId]
            );
            console.log(`🔔 Synced order ${orderId} logistics tracking (FedEx) to Cancelled status.`);

            // Trigger auto-refund if this is a PhonePe payment
            if (orderId.startsWith('ORD-PP-')) {
                // Calculate the total order amount: subtotal + shipping + taxes
                const subtotal = currentOrders.reduce((sum, item) => {
                    const priceVal = parseFloat((item.price || '').replace(/[^0-9.]/g, '')) || 0;
                    return sum + priceVal;
                }, 0);
                
                const shipping = subtotal > 500 ? 0 : 25;
                const taxes = subtotal * 0.08;
                const totalAmountUSD = subtotal + shipping + taxes;

                console.log(`Order ${orderId} is a PhonePe order. Initiating auto-refund of $${totalAmountUSD.toFixed(2)} USD...`);
                try {
                    const refundResult = await phonePeService.refundPayment(orderId, totalAmountUSD);
                    console.log(`Refund request status for ${orderId}:`, refundResult);

                    if (refundResult && refundResult.success) {
                        // Update refund status in user_orders
                        await db.query(
                            'UPDATE user_orders SET refund_id = ?, refund_status = ? WHERE order_id = ?',
                            [refundResult.refundId, refundResult.state, orderId]
                        );
                        console.log(`Successfully recorded refund ID ${refundResult.refundId} and status ${refundResult.state} in database for order ${orderId}`);
                    }
                } catch (refundError) {
                    console.error(`Error processing automatic refund for PhonePe order ${orderId}:`, refundError);
                }
            } else {
                console.log(`Order ${orderId} is not a PhonePe payment. Simulating refund check...`);
                // For non-PhonePe orders (like Credit Card), we can just set dummy status
                await db.query(
                    'UPDATE user_orders SET refund_status = "SUCCESS", refund_id = ? WHERE order_id = ?',
                    [`REF-SIM-${Date.now()}`, orderId]
                );
            }
        }

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

// POST /api/orders
// Create a consolidated order from items (for Credit Card checkout)
router.post('/', async (req, res) => {
    const { userId, orderId, items } = req.body;

    if (!userId || !orderId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Missing required parameters: userId, orderId, items' });
    }

    try {
        console.log(`Creating consolidated order ${orderId} for user ${userId} with ${items.length} items...`);
        for (const item of items) {
            const orderStatus = item.status || 'Processing';
            const prodId = item.productId || null;
            const qty = item.quantity || 1;
            const sz = item.selectedSize || null;

            await db.query(
                `INSERT INTO user_orders (user_id, order_id, product_name, price, image_url, status, product_id, quantity, selected_size)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, orderId, item.productName, item.price, item.imageUrl, orderStatus, prodId, qty, sz]
            );
        }

        // Trigger consolidated order confirmation email asynchronously
        console.log(`Order ${orderId} created. Triggering order confirmation email...`);
        emailService.sendOrderConfirmationEmail(orderId).catch(err => {
            console.error(`Error in sendOrderConfirmationEmail background task for order ${orderId}:`, err);
        });

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        console.error('Error creating consolidated order:', error);
        res.status(500).json({ message: 'Internal server error creating order', error: error.message });
    }
});

module.exports = router;
