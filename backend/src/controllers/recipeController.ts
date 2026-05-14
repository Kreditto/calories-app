import { Response } from 'express';
import { Recipe } from '../models/Recipe';
import { type UserAuthRequest } from '../middleware/authCheck';

export const createRecipe = async (req: UserAuthRequest, res: Response) => {
    try {
        const { 
            name, 
            description, 
            caloriesPer100, 
            bilkyPer100, 
            zhyryPer100, 
            vuglevodyPer100,
            ingredients  
        } = req.body;
        
        const userId = req.userId;

        const recipe = new Recipe({
            name,
            description,
            authorId: userId,
            caloriesPer100: Number(caloriesPer100),
            bilkyPer100: Number(bilkyPer100),
            zhyryPer100: Number(zhyryPer100),
            vuglevodyPer100: Number(vuglevodyPer100),
            ingredients: ingredients || [],  
            statusRep: 'pending'
        });

        await recipe.save();

        res.status(201).json({ message: 'рецепт створено', recipe });

    } catch (err) {
        res.status(500).json({ message: 'помилка при створені рецепту' });
    }
};

export const getAllRecipes = async (_req: UserAuthRequest, res: Response) => {
    try {
       const recipes = await Recipe.find({
            statusRep: 'approved'
        }).populate('authorId', 'login');

        res.status(200).json({ message: 'рецепти успішно отримано', recipes });

    } catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};

export const getMyRecipes = async (req: UserAuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({message: 'не авторизовано'});
        }

        const recipes = await Recipe.find({
            authorId: userId
        }).populate('authorId', 'login')
        .sort({ createdAt: -1 });

        res.status(200).json({ message: 'ваші рецепти успішно отримано', recipes });

    } catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};