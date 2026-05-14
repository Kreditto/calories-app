import { Response } from 'express';
import mongoose from "mongoose";
import { MealRecord } from '../models/MealRecord';
import { Food } from '../models/Food';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { type UserAuthRequest } from '../middleware/authCheck';

export const addMealRecord = async (req: UserAuthRequest, res: Response) => {
    try {
        const { FoodType, foodId, grams } = req.body;
        if ((FoodType === 'poludenok' || FoodType === 'perekus') && req.userRole !== 'premium') {
            return res.status(403).json({ message: 'цей тип прийому тільки для Premium користувачів' });
        }

        const product = await Food.findById(foodId);
        if (!product) {
            return res.status(404).json({ message: 'продукт не знайдено в базі даних' });
        }

        const factor = grams / 100;
        const novyjZapys = new MealRecord({
            userId: req.userId,
            FoodType,
            foodId: product._id,
            grams: grams,
            calculatedCalories: Math.round(product.caloriesPer100 * factor),
            calculatedBilky: Math.round(product.bilkyPer100 * factor),
            calculatedZhyry: Math.round(product.zhyryPer100 * factor),
            calculatedVuglevody: Math.round(product.vuglevodyPer100 * factor)
        });

        await novyjZapys.save();

        res.status(201).json({ message: 'успішно додано до щоденника', zapys: novyjZapys });

    } catch (err) {
        res.status(500).json({ message: 'помилка при додаванні запису.' });
    }
};

export const addRecipeToDiary = async (req: UserAuthRequest, res: Response) => {
    try {
        const { recipeId, grams, FoodType } = req.body;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "рецепт не знайдено" });
        }

        const factor = grams / 100;
        const novyjZapys = new MealRecord({
            userId: req.userId,
            FoodType,
            recipeId: recipe._id,
            grams,
            calculatedCalories: Math.round(recipe.caloriesPer100 * factor),
            calculatedBilky: Math.round(recipe.bilkyPer100 * factor),
            calculatedZhyry: Math.round(recipe.zhyryPer100 * factor),
            calculatedVuglevody: Math.round(recipe.vuglevodyPer100 * factor)
        });
        await novyjZapys.save();

        res.status(201).json({ message: "рецепт додано у щоденник", zapys: novyjZapys });

    } catch (err) {
        res.status(500).json({ message: "помилка додавання рецепта."});
    }
};

export const getStatistics = async (req: UserAuthRequest, res: Response) => {
    try {
        if (!req.userId) return res.status(401).json({ message: 'авторизуйтесь' });

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const zapysy = await MealRecord.find({
            userId: req.userId,
            dataPryyomu: { $gte: start, $lte: end }
        })
        .populate('foodId', 'name')
        .populate('recipeId', 'name');

        const goal = await User.findById(req.userId);
        const totals = zapysy.reduce((acc, curr) => {
            acc.calories += curr.calculatedCalories || 0;
            acc.bilky += curr.calculatedBilky || 0;
            acc.zhyry += curr.calculatedZhyry || 0;
            acc.vuglevody += curr.calculatedVuglevody || 0;
            return acc;
        }, { calories: 0, bilky: 0, zhyry: 0, vuglevody: 0 });

        res.json({
            sumaKaloriy: totals.calories,
            sumaBilky: totals.bilky,
            sumaZhyry: totals.zhyry,
            sumaVuglevody: totals.vuglevody,
            tsil: goal, 
            zalishokKkal: (goal && goal.calories) ? (goal.calories - totals.calories) : 0,
            zapysy 
        });

    } catch (err) {
        res.status(500).json({ message: 'помилка отримання статистики' });
    }
};

export const getHistory = async (req: UserAuthRequest, res: Response) => {
    try {
        const userIdObj = new mongoose.Types.ObjectId(req.userId);
        const istoriya = await MealRecord.aggregate([
            { $match: { userId: userIdObj } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dataPryyomu" } },
                    vsogo_kkal: { $sum: "$calculatedCalories" },
                    kilkist_pryyomiv: { $sum: 1 }
                }
            },
            { $sort: { "_id": -1 } } 
        ]);

        res.status(200).json({ message: 'історія успішно отримана', istoriya });

    } catch (err) {
        res.status(500).json({ message: 'помилка отримання історії.' });
    }
};

export const deleteMealRecord = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!id || !userId) {
            return res.status(400).json({ message: 'відсутній ID запису або користувача.' });
        }
        
        const deletedRecord = await MealRecord.findOneAndDelete({ 
            _id: id, 
            userId: userId 
        });
        if (!deletedRecord) {
            return res.status(404).json({ message: 'запис не знайдено.' });
        }

        res.status(200).json({ message: 'запис успішно видалено' });

    } catch (err) {
        res.status(500).json({ message: 'помилка видалення.' });
    }
};

export const updateMealRecord = async (req: UserAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { grams } = req.body;
        const userId = req.userId;
        if (!id || !userId || !grams || grams <= 0) {
            return res.status(400).json({ message: 'некоректні дані' });
        }
        const record = await MealRecord.findOne({ _id: id, userId: userId })
            .populate('foodId')
            .populate('recipeId');
        
        if (!record) return res.status(404).json({ message: 'запис не знайдено' });
        const source = (record.foodId || record.recipeId) as any;
        if (!source) return res.status(400).json({ message: 'дані про продукт/рецепт втрачені' });

        const factor = grams / 100;
        record.grams = grams;
        record.calculatedCalories = Math.round(source.caloriesPer100 * factor);
        record.calculatedBilky = Math.round(source.bilkyPer100 * factor);
        record.calculatedZhyry = Math.round(source.zhyryPer100 * factor);
        record.calculatedVuglevody = Math.round(source.vuglevodyPer100 * factor);

        await record.save();
        
        res.status(200).json({ message: 'запис оновлено', zapys: record });

    } catch (err) {
        res.status(500).json({ message: 'помилка оновлення запису.' });
    }
};