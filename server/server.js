import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { serve } from 'inngest/express';


// Import config
import connectDB from './config/db.js';
import { inngest } from './config/inngest.js';
import { functions } from './inngest/functions.js';

// Import routes
import {
    authRoutes, adminRoutes, productRoutes,
    reviewRoutes, addressRoutes, orderRoutes, paymentRoutes
} from './routes/index.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Inngest
app.use('/api/inngest', serve({ client: inngest, functions }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Server is running'});
});

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
});

export default app;
