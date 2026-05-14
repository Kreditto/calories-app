import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';
import { type UserAuthRequest } from '../middleware/authCheck';


// їжа
export const deleteFood = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return res.status(404).json({ message: 'їжу не знайдено.' });
        }

        res.status(200).json({ message: "страву видалено" });

    } catch (err) {
        res.status(500).json({ message: "помилка при видаленні" });
    }
};

export const CreateFood = async (req: UserAuthRequest, res: Response) => {
    try {
        const { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const newFood = new Food({
            name,
            caloriesPer100,
            bilkyPer100,
            zhyryPer100,
            vuglevodyPer100
        });
        await newFood.save();

        await User.findByIdAndUpdate(
            req.userId,
            {
                $inc: {
                    CreatedFood: 1
                }
            }
        );

        res.status(201).json({ message: 'продукт додано', food: newFood });

    } catch (err) {
        res.status(500).json({ message: "помилка при додаванні продукту" });
    }
};

export const getAllFood = async (_req: UserAuthRequest, res: Response) => {
    try {
        const food = await Food.find({});
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json({ message: "помилка отримання їжі" });
    }
};

export const updateFood = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 },
            { new: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ message: 'їжу не знайдено' });
        }

        res.status(200).json({ message: 'їжу оновлено', food: updatedFood });

    } catch (err) {
        res.status(500).json({ message: "помилка при оновленні їжі" });
    }
};

// рецепти
export const updateRecipe = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 },
            { new: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: 'рецепт не знайдено' });
        }

        res.status(200).json({ message: 'рецепт оновлено', recipe: updatedRecipe });

    } catch (err) {
        res.status(500).json({ message: "помилка при оновленні рецепту" });
    }
};

export const getAllRecipes = async (_req: UserAuthRequest, res: Response) => {
    try {
        const recipes = await Recipe.find({});

        res.status(200).json({ message: 'рецепти успішно отримано', recipes });

    } catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};


export const getPendingRecipe = async (_req: UserAuthRequest, res: Response) => {
    try {
        const pendingRecipes = await Recipe.find({
            statusRep: 'pending'
        });

        res.status(200).json(pendingRecipes);

    } catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів на модерацію" });
    }
};

export const approveRecipe = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { statusRep: 'approved' }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: "рецепт не знайдено" });
        }

        await User.findByIdAndUpdate(
            req.userId,
            {
                $inc: {
                    approvedRecipes: 1
                }
            }
        );

        res.status(200).json({ message: "успішно підтверджено" });

    } catch (err) {
        res.status(500).json({ message: "помилка при підтвердженні" });
    }
};

export const deleteRecipe = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        if (!deletedRecipe) {
            return res.status(404).json({ message: 'рецепт не знайдено.' });
        }

        res.status(200).json({ message: "рецепт видалено" });

    } catch (err) {
        res.status(500).json({ message: "Помилка при видаленні" });
    }
};

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
        const newRecipe = new Recipe({
            name,
            description,
            isPublic: isPublic !== undefined ? isPublic : true,
            authorId: userId,
            caloriesPer100: Number(caloriesPer100),
            bilkyPer100: Number(bilkyPer100),
            zhyryPer100: Number(zhyryPer100),
            vuglevodyPer100: Number(vuglevodyPer100),
            ingredients: [],
            statusRep: 'approved'
        });

        await newRecipe.save();

        await User.findByIdAndUpdate(
            req.userId,
            {
                $inc: {
                    CreatedRecipes: 1
                }
            }
        );

        res.status(201).json({ message: 'рецепт створено', recipe: newRecipe });

    } catch (err) {
        res.status(500).json({ message: 'помилка при створені рецепту' });
    }
};

export const getAdminStats = async (req: UserAuthRequest, res: Response) => {
    try {

        const admin = await User.findById(req.userId);

        if (!admin) {
            return res.status(404).json({
                message: 'адміна не знайдено'
            });
        }

        res.status(200).json({
            CreatedFood: admin.CreatedFood,
            CreatedRecipes: admin.CreatedRecipes,
            approvedRecipes: admin.approvedRecipes
        });

    } catch (err) {
        res.status(500).json({message: 'Помилка при отриманні статистики'});
    }
};

