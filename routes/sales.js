import express from 'express';
const router = express.Router();
import db from '../app-db.js';
// Get all sales
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Sales');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total sales by month
router.get('/monthly', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                EXTRACT(YEAR FROM order_date) AS year,
                EXTRACT(MONTH FROM order_date) AS month,
                SUM(total) AS total_amount
            FROM
                orders
            GROUP BY
                month , year
            ORDER BY
                month ASC, year ASC;
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new sale
router.post('/', async (req, res) => {
    const { order_id, product_id, quantity, total, location_id } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Sales (order_id, product_id, quantity, total, location_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [order_id, product_id, quantity, total, location_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a sale
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { order_id, product_id, quantity, total, location_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE Sales SET order_id = $1, product_id = $2, quantity = $3, total = $4, location_id = $5 WHERE sale_id = $6 RETURNING *',
            [order_id, product_id, quantity, total, location_id, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Sales WHERE sale_id = $1', [id]);
        res.json({ message: 'Sale deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Additional CRUD operations for sales...

export default router;