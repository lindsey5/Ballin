import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';

const app = express();
// middleware & static files
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/product', productRoutes)

export default app