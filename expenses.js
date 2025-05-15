import express from 'express';
const router = express.Router();
import db from '../../app-db.js';

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Expenses');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total expenses by month
router.get('/monthly', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT EXTRACT(YEAR FROM expense_date) AS year,
                   EXTRACT(MONTH FROM expense_date) AS month,
                   SUM(amount) AS total_amount
            FROM Expenses
            GROUP BY year, month
            ORDER BY year ASC, month ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new expense
router.post('/', async (req, res) => {
    const { employee_id, category_id, amount, expense_date, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Expenses (employee_id, category_id, amount, expense_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [employee_id, category_id, amount, expense_date, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an expense
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { employee_id, category_id, amount, expense_date, description } = req.body;
    try {
        const result = await db.query(
            'UPDATE Expenses SET employee_id = $1, category_id = $2, amount = $3, expense_date = $4, description = $5 WHERE expense_id = $6 RETURNING *',
            [employee_id, category_id, amount, expense_date, description, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Expenses WHERE expense_id = $1', [id]);
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;