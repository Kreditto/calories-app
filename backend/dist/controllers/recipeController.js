"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRecipes = exports.getAllRecipes = exports.createRecipe = void 0;
const Recipe_1 = require("../models/Recipe");
const createRecipe = async (req, res) => {
    try {
        const { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const userId = req.userId;
        const recipe = new Recipe_1.Recipe({
            name,
            description,
            isPublic: isPublic !== undefined ? isPublic : true,
            authorId: userId,
            caloriesPer100: Number(caloriesPer100),
            bilkyPer100: Number(bilkyPer100),
            zhyryPer100: Number(zhyryPer100),
            vuglevodyPer100: Number(vuglevodyPer100),
            ingredients: [],
            statusRep: 'pending'
        });
        await recipe.save();
        res.status(201).json({ message: 'рецепт створено', recipe });
    }
    catch (err) {
        res.status(500).json({ message: 'помилка при створені рецепту' });
    }
};
exports.createRecipe = createRecipe;
const getAllRecipes = async (_req, res) => {
    try {
        const recipes = await Recipe_1.Recipe.find({
            statusRecipe: 'approved'
        }).populate('authorId', 'login');
        res.status(200).json({ message: 'рецепти успішно отримано', recipes });
    }
    catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};
exports.getAllRecipes = getAllRecipes;
const getMyRecipes = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'не авторизовано' });
        }
        const recipes = await Recipe_1.Recipe.find({
            authorId: userId
        }).populate('authorId', 'login')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'ваші рецепти успішно отримано', recipes });
    }
    catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};
exports.getMyRecipes = getMyRecipes;
//# sourceMappingURL=recipeController.js.map