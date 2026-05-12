import { Response } from 'express';
import { Recipe } from '../models/Recipe';
import { type UserAuthRequest } from '../middleware/authCheck';

export const createRecipe = async (req: UserAuthRequest, res: Response) => {
    try {
        const { 
            name, 
            description, 
            isPublic, 
            caloriesPer100, 
            bilkyPer100, 
            zhyryPer100, 
            vuglevodyPer100 
        } = req.body;
        const userId = req.userId;
        const recipe = new Recipe({
            name,
            description,
            isPublic: isPublic !== undefined ? isPublic : true,
            authorId: userId,
            caloriesPer100: Number(caloriesPer100),
            bilkyPer100: Number(bilkyPer100),
            zhyryPer100: Number(zhyryPer100),
            vuglevodyPer100: Number(vuglevodyPer100),
            ingredients: [] 
        });

        await recipe.save();
        res.status(201).json(recipe);

    } catch (err: any) {
        res.status(500).json({ message: 'помилка при створені рецепту' });
    }
};

export const getAllRecipes = async (_req: UserAuthRequest, res: Response) => {
    try {
        const conditions: any[] = [
            { authorId: null },
            { isPublic: true }
        ];
        const recipes = await Recipe.find({
            $or: conditions
        }).populate('authorId', 'username');
        
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};