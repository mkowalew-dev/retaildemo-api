import express from 'express';
const router = express.Router();
import db from '../../app-db.js';

// Get total number of employees
router.get('/employees/count', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM Employees');
        res.json({ totalEmployees: parseInt(result.rows[0].count, 10) });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employee count' });
    }
});

// Get count of employees per month based on hire date
router.get('/employees/count/monthly', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT EXTRACT(MONTH FROM hire_date) AS month, COUNT(*) 
      FROM Employees 
      GROUP BY month 
      ORDER BY month
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching monthly employee counts' });
    }
});

// Get list of employees
router.get('/employees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Employees');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees' });
    }
});

// Get an employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Employees WHERE employee_id = $1', [req.params.id]);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employee' });
    }
});

// Get an employee by name
router.get('/employees/name/:name', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM Employees WHERE first_name LIKE $1 OR last_name LIKE $1', [`%${req.params.name}%`]
        );
        if (result.rows.length) {
            res.json(result.rows);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employee' });
    }
});

// Update an employee record
router.put('/employees/:id', async (req, res) => {
    const { first_name, last_name, email, phone, position, salary, hire_date, avatar_url } = req.body;
    try {
        const result = await db.query(
            `UPDATE Employees SET 
        first_name = $1, last_name = $2, email = $3, phone = $4, 
        position = $5, salary = $6, hire_date = $7, avatar_url = $8 
      WHERE employee_id = $9 RETURNING *`,
            [first_name, last_name, email, phone, position, salary, hire_date, avatar_url, req.params.id]
        );
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating employee' });
    }
});

// Create a new employee record
router.post('/employees', async (req, res) => {
    const { first_name, last_name, email, phone, position, salary, hire_date, avatar_url } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO Employees (first_name, last_name, email, phone, position, salary, hire_date, avatar_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [first_name, last_name, email, phone, position, salary, hire_date, avatar_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creating employee' });
    }
});

// Delete an employee record
router.delete('/employees/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Employees WHERE employee_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
});



export default router;