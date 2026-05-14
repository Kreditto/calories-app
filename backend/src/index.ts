import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pidkluchennyaDoBazy } from './db/connect';
import authRoutes from './routes/authRoutes';
import mealRoutes from './routes/mealRoutes';
import foodRoutes from './routes/foodRoutes';
import recipeRoutes from './routes/recipeRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
// Middleware
app.use(cors());

app.use(express.json());
pidkluchennyaDoBazy();

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);
console.log('adminRoutes підключено');
app.use('/api/admin', (req, res, next) => {
    console.log('admin запит:', req.method, req.path);
    next();
});
app.use('/api/admin', adminRoutes);


app.listen(PORT, () => {
    console.log("Сервер на порту", {PORT});
});