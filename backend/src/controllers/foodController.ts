import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { User } from '../models/User';
import { type UserAuthRequest } from '../middleware/authCheck';

export const searchFood = async (req: UserAuthRequest, res: Response) => {
    const query = req.query.q as string;
    if (!query || query.length < 2){
        return res.json([]);
    } 
    const products = await Food.find({
        name: { $regex: query, $options: 'i' }
    }).limit(15);

    res.json(products);
};

export const addFoodToLibrary = async (req: UserAuthRequest, res: Response) => {
    const { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'користувача не знайдено' });
    } 
    const newFood = new Food({
        name,
        caloriesPer100,
        bilkyPer100,
        zhyryPer100,
        vuglevodyPer100,
        source: 'user_contributed',
        addedBy: user.login
    });

    await newFood.save();
    res.status(201).json({ message: 'продукт додано', food: newFood });
};