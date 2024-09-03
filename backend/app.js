import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.route.js';
import paymentRoutes from './routes/payment.route.js'


import errorMiddleware from './middlewares/error.middleware.js';

config(); // Load environment variables

const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));

app.use('/ping', (req, res) => {
    res.send('/pong');
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.all('*', (req, res) => {
    res.status(404).send('OOPS!! 404 Not Found');
});

app.use(errorMiddleware)

export default app;
