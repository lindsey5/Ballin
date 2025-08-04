import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cartRoutes.js';

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

app.use('/api/product', productRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api', authRoutes);

export default app