import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import { chatAIagent } from './controllers/agentController.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import lowStockRoutes from './routes/lowStockRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import variantRoutes from './routes/variantRoutes.js';

const app = express();
// middleware & static files
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post('/api/agent/chat', chatAIagent)

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/low-stocks', lowStockRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/variants', variantRoutes);

export default app