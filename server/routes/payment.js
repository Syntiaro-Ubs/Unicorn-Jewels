// routes/payment.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const phonePeService = require('../services/phonepeService');

// POST /api/payment/phonepe/initiate
router.post('/phonepe/initiate', async (req, res) => {
  const { userId, amount, items } = req.body;

  if (!userId || !amount || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required parameters: userId, amount, items' });
  }

  // Generate a unique order ID (Max 63 chars, letters/numbers/hyphen/underscore)
  const orderId = `ORD-PP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    // Save items to user_orders table with status 'Pending Payment'
    for (const item of items) {
      // Format item price string just like original (e.g. "$12,500")
      const formattedItemPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(item.priceNum * item.quantity);

      await db.query(
        `INSERT INTO user_orders (user_id, order_id, product_name, price, image_url, status, product_id, quantity, selected_size)
         VALUES (?, ?, ?, ?, ?, 'Pending Payment', ?, ?, ?)`,
        [userId, orderId, item.name, formattedItemPrice, item.image, item.id, item.quantity, item.selectedSize || null]
      );
    }

    // Determine return URL based on request headers dynamically (localhost or production domain)
    const origin = req.headers.origin || 'http://localhost:5173';
    const redirectUrl = `${origin}/?phonepe_order_id=${orderId}`;

    // Call PhonePe service to initiate payment
    console.log(`Initiating PhonePe payment for order ${orderId}, amount: ${amount} USD`);
    const phonepeResponse = await phonePeService.initiatePayment(orderId, amount, redirectUrl);

    res.json({
      orderId,
      redirectUrl: phonepeResponse.redirectUrl
    });
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    res.status(500).json({ message: 'Internal server error initiating payment', error: error.message });
  }
});

// GET /api/payment/phonepe/status/:orderId
router.get('/phonepe/status/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log(`Checking PhonePe payment status for order: ${orderId}`);
    const statusData = await phonePeService.checkPaymentStatus(orderId);

    // If order was successfully completed
    if (statusData.state === 'COMPLETED') {
      // Retrieve the pending orders
      const [pendingOrders] = await db.query(
        'SELECT * FROM user_orders WHERE order_id = ? AND status = "Pending Payment"',
        [orderId]
      );

      if (pendingOrders.length > 0) {
        console.log(`Payment success for ${orderId}. Updating database and reducing stock...`);
        
        // 1. Update order status to 'Processing'
        await db.query(
          'UPDATE user_orders SET status = "Processing" WHERE order_id = ?',
          [orderId]
        );

        // 2. Reduce inventory stock for the purchased items
        for (const order of pendingOrders) {
          if (order.product_id) {
            const numericId = parseInt(order.product_id, 10);
            if (!isNaN(numericId) && String(numericId) === String(order.product_id)) {
              // Ensure product exists in DB before updating stock
              const [dbProd] = await db.query('SELECT id FROM products WHERE id = ?', [numericId]);
              if (dbProd.length > 0) {
                await db.query(
                  'UPDATE products SET stock = stock - ? WHERE id = ?',
                  [order.quantity, numericId]
                );
                if (order.selected_size) {
                  await db.query(
                    'UPDATE product_variants SET stock = stock - ? WHERE product_id = ? AND size = ?',
                    [order.quantity, numericId, order.selected_size]
                  );
                }
                console.log(`Reduced stock by ${order.quantity} (Size: ${order.selected_size || 'None'}) for product ID: ${numericId}`);
              } else {
                console.log(`Product ID ${numericId} not found in database. Skipping stock update.`);
              }
            } else {
              console.log(`Skipping stock reduction for mock/frontend product ID: ${order.product_id}`);
            }
          }
        }
      }

      return res.json({ success: true, status: 'COMPLETED' });
    } else if (statusData.state === 'FAILED') {
      // Delete the pending orders from database as the payment failed
      console.log(`Payment failed for order ${orderId}. Deleting pending order records...`);
      await db.query(
        'DELETE FROM user_orders WHERE order_id = ?',
        [orderId]
      );
      return res.json({ success: false, status: 'FAILED' });
    } else {
      // Pending or other states
      return res.json({ success: false, status: statusData.state || 'PENDING' });
    }
  } catch (error) {
    console.error(`Error checking PhonePe payment status for ${orderId}:`, error);
    res.status(500).json({ message: 'Internal server error checking payment status', error: error.message });
  }
});

module.exports = router;
