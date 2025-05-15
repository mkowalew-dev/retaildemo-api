import express from 'express';
const router = express.Router();
import db from '../../app-db.js';

// Helper function to get order count by month and status
const getOrderCountByMonthAndStatus = async (status) => {
    try {
        const result = await db.query(`
      SELECT 
        TO_CHAR(order_date, 'MM-YYYY') AS month,
        COUNT(*) AS total_orders
      FROM Orders
      WHERE status = $1
      GROUP BY month
      ORDER BY month ASC
    `, [status]);
        return result.rows;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Get completed orders
router.get('/completed', async (req, res) => {
    try {
        const orders = await getOrderCountByMonthAndStatus('Completed');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get canceled orders
router.get('/canceled', async (req, res) => {
    try {
        const orders = await getOrderCountByMonthAndStatus('Canceled');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get pending orders
router.get('/pending', async (req, res) => {
    try {
        const orders = await getOrderCountByMonthAndStatus('Pending');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get shipped orders
router.get('/shipped', async (req, res) => {
    try {
        const orders = await getOrderCountByMonthAndStatus('Shipped');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;