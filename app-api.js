import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import salesRoutes from './routes/sales.js';
import expensesRoutes from './routes/expenses.js';
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import employeesRoutes from "./routes/employees.js";
import slowDown from "express-slow-down";

const appApi = express();
const PORT = 4000; // Unique port for API Service

const limiter = slowDown({
    windowMs: 10 * 60 * 1000, // 15 minutes
    delayAfter: 5, // Allow 5 requests per 15 minutes.
    delayMs: (hits) => hits * 1000,
    maxDelayMs: 4000,
    /**
     * So:
     *
     * - requests 1-5 are not delayed.
     * - request 6 is delayed by 1000ms
     * - request 7 is delayed by 2000ms
     * - request 8 is delayed by 3000ms
     * - request 9 is delayed by 4000ms
     *
     *  After 10 minutes, the delay is reset to 0.
     */
})

appApi.use(cors());
appApi.use(bodyParser.json());
appApi.use(limiter)



appApi.use('/api/sales', salesRoutes);
appApi.use('/api/expenses', expensesRoutes);
appApi.use('/api/auth', authRoutes);
appApi.use('/api/orders', orderRoutes);
appApi.use('/api/operations/', employeesRoutes);

appApi.listen(PORT, () => {
    console.log(`API service running on port ${PORT}`);
});