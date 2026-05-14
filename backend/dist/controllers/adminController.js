"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.createRecipe = exports.deleteRecipe = exports.approveRecipe = exports.getPendingRecipe = exports.getAllRecipes = exports.updateRecipe = exports.updateFood = exports.getAllFood = exports.CreateFood = exports.deleteFood = void 0;
const Food_1 = require("../models/Food");
const User_1 = require("../models/User");
const Recipe_1 = require("../models/Recipe");
// їжа
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFood = await Food_1.Food.findByIdAndDelete(id);
        if (!deletedFood) {
            return res.status(404).json({ message: 'їжу не знайдено.' });
        }
        res.status(200).json({ message: "страву видалено" });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при видаленні" });
    }
};
exports.deleteFood = deleteFood;
const CreateFood = async (req, res) => {
    try {
        const { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const newFood = new Food_1.Food({
            name,
            caloriesPer100,
            bilkyPer100,
            zhyryPer100,
            vuglevodyPer100
        });
        await newFood.save();
        await User_1.User.findByIdAndUpdate(req.userId, {
            $inc: {
                CreatedFood: 1
            }
        });
        res.status(201).json({ message: 'продукт додано', food: newFood });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при додаванні продукту" });
    }
};
exports.CreateFood = CreateFood;
const getAllFood = async (_req, res) => {
    try {
        const food = await Food_1.Food.find({});
        res.status(200).json(food);
    }
    catch (err) {
        res.status(500).json({ message: "помилка отримання їжі" });
    }
};
exports.getAllFood = getAllFood;
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const updatedFood = await Food_1.Food.findByIdAndUpdate(id, { name, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 }, { new: true });
        if (!updatedFood) {
            return res.status(404).json({ message: 'їжу не знайдено' });
        }
        res.status(200).json({ message: 'їжу оновлено', food: updatedFood });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при оновленні їжі" });
    }
};
exports.updateFood = updateFood;
// рецепти
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const updatedRecipe = await Recipe_1.Recipe.findByIdAndUpdate(id, { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 }, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'рецепт не знайдено' });
        }
        res.status(200).json({ message: 'рецепт оновлено', recipe: updatedRecipe });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при оновленні рецепту" });
    }
};
exports.updateRecipe = updateRecipe;
const getAllRecipes = async (_req, res) => {
    try {
        const recipes = await Recipe_1.Recipe.find({});
        res.status(200).json({ message: 'рецепти успішно отримано', recipes });
    }
    catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів" });
    }
};
exports.getAllRecipes = getAllRecipes;
const getPendingRecipe = async (_req, res) => {
    try {
        const pendingRecipes = await Recipe_1.Recipe.find({
            statusRep: 'pending'
        });
        res.status(200).json(pendingRecipes);
    }
    catch (err) {
        res.status(500).json({ message: "помилка отримання рецептів на модерацію" });
    }
};
exports.getPendingRecipe = getPendingRecipe;
const approveRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRecipe = await Recipe_1.Recipe.findByIdAndUpdate(id, { statusRep: 'approved' });
        if (!updatedRecipe) {
            return res.status(404).json({ message: "рецепт не знайдено" });
        }
        await User_1.User.findByIdAndUpdate(req.userId, {
            $inc: {
                approvedRecipes: 1
            }
        });
        res.status(200).json({ message: "успішно підтверджено" });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при підтвердженні" });
    }
};
exports.approveRecipe = approveRecipe;
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await Recipe_1.Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'рецепт не знайдено.' });
        }
        res.status(200).json({ message: "рецепт видалено" });
    }
    catch (err) {
        res.status(500).json({ message: "Помилка при видаленні" });
    }
};
exports.deleteRecipe = deleteRecipe;
const createRecipe = async (req, res) => {
    try {
        const { name, description, isPublic, caloriesPer100, bilkyPer100, zhyryPer100, vuglevodyPer100 } = req.body;
        const userId = req.userId;
        const newRecipe = new Recipe_1.Recipe({
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
        await User_1.User.findByIdAndUpdate(req.userId, {
            $inc: {
                CreatedRecipes: 1
            }
        });
        res.status(201).json({ message: 'рецепт створено', recipe: newRecipe });
    }
    catch (err) {
        res.status(500).json({ message: 'помилка при створені рецепту' });
    }
};
exports.createRecipe = createRecipe;
const getAdminStats = async (req, res) => {
    try {
        const admin = await User_1.User.findById(req.userId);
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
    }
    catch (err) {
        res.status(500).json({ message: 'Помилка при отриманні статистики' });
    }
};
exports.getAdminStats = getAdminStats;
//# sourceMappingURL=adminController.js.map