import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import salesRoutes from './routes/sales.js';
import expensesRoutes from './routes/expenses.js';
import rateLimit from'express-rate-limit';
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import employeesRoutes from "./routes/employees.js";

const apiApp = express();
const PORT = 3001; // Unique port for Sales service

//express rate-limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 50, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

apiApp.use(cors());
apiApp.use(bodyParser.json());


apiApp.use('/api/sales', salesRoutes);
apiApp.use('/api/expenses', expensesRoutes);
apiApp.use('/api/auth', authRoutes);
apiApp.use('/api/orders', orderRoutes);
apiApp.use('/api/operations/', employeesRoutes);

apiApp.listen(PORT, () => {
    console.log(`Api service running on port ${PORT}`);
});