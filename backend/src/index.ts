import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pidkluchennyaDoBazy } from './db/connect';
import authRoutes from './routes/authRoutes';
import mealRoutes from './routes/mealRoutes';
import foodRoutes from './routes/foodRoutes';
import recipeRoutes from './routes/recipeRoutes';
import userRoutes from './routes/userRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());

app.use(express.json());
pidkluchennyaDoBazy();

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);






app.listen(PORT, () => {
    console.log("Сервер на порту", {PORT});
});