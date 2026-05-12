import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { Recipe } from '../models/Recipe';
import { type UserAuthRequest } from '../middleware/authCheck';


// їжа
export const getPendingFood = async (_req: UserAuthRequest, res: Response) => {
    try {
        const pendingFood = await Food.find({
            source: 'user_contributed',
            statusFood: 'pending'
        });

        res.json(pendingFood);
    } catch (err) {
        res.status(500).json({ message: "помилка отримання їжі на модерацію" });
    }
};

export const approveFood = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params; 
        const updatedFood = await Food.findByIdAndUpdate(
            id, 
            {statusFood: 'approved'} 
        );

        if (!updatedFood) {
            return res.status(404).json({ message: "страву не знайдено" });
        }

        res.json({ message: "успішно підтверджено"});
    } catch (err) {
        res.status(500).json({ message: "помилка при підтвердженні" });
    }
};

export const deleteFood = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return res.status(404).json({ message: 'їжу не знайдено.' });
        }

        res.json({ message: "страву видалено" });
    } catch (err) {
        res.status(500).json({ message: "Помилка при видаленні" });
    }
};


//рецепти
export const getPendingRecipe = async (_req: UserAuthRequest, res: Response) => {

};

export const approveRecipe = async (req: UserAuthRequest, res: Response) => {

};

export const deleteRecipe = async (req: UserAuthRequest, res: Response) => {
    
};
