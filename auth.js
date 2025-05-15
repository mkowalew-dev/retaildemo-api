import express from 'express';
const router = express.Router();
import db from '../../app-db.js';

// Verify API Key
router.get('/verify', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: API key required' });
    }

    try {
        const result = await db.query('SELECT * FROM apikeys WHERE api_key = $1', [apiKey]);
        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Forbidden: Invalid API key' });
        }
        res.json({ message: 'API key is valid' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;