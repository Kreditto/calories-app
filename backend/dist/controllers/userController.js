"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPremium = exports.buyPremium = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.User.findById(userId).select('-password');
        if (!user)
            return res.status(404).json({ message: 'користувача не знайдено' });
        res.status(200).json({ message: 'профіль отримано', user });
    }
    catch (err) {
        res.status(500).json({ message: 'помилка при отриманні даних профілю.' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { email, password, vaga, zrist, vik, stat, activity, goal, calories, bilky, zhyry, vuglevody } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'користувача не знайдено' });
        if (email)
            user.email = email;
        user.vaga = vaga || user.vaga;
        user.zrist = zrist || user.zrist;
        user.vik = vik || user.vik;
        user.stat = stat || user.stat;
        user.activity = activity || user.activity;
        user.goal = goal || user.goal;
        user.calories = calories || user.calories;
        user.bilky = bilky || user.bilky;
        user.zhyry = zhyry || user.zhyry;
        user.vuglevody = vuglevody || user.vuglevody;
        if (password && password.trim() !== "") {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(password, salt);
        }
        await user.save();
        res.status(200).json({ message: 'профіль та цілі оновлено' });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при оновленні профілю" });
    }
};
exports.updateProfile = updateProfile;
const buyPremium = async (req, res) => {
    try {
        const { cardNumber, expiryDate, cardHolder, cvv } = req.body;
        const userId = req.userId;
        if (!cardNumber || !cvv) {
            return res.status(400).json({ message: "введіть коректні дані картки" });
        }
        const updatedUser = await User_1.User.findByIdAndUpdate(userId, {
            userRole: 'premium',
            cardData: { cardNumber, expiryDate, cardHolder }
        }, { new: true });
        if (!updatedUser)
            return res.status(404).json({ message: "користувача не знайдено" });
        const newToken = jsonwebtoken_1.default.sign({ id: updatedUser._id, role: 'premium' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.status(200).json({ message: "підписку оформлено успішно.", token: newToken, role: 'premium' });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при оплаті" });
    }
};
exports.buyPremium = buyPremium;
const cancelPremium = async (req, res) => {
    try {
        const userId = req.userId;
        const updatedUser = await User_1.User.findByIdAndUpdate(userId, {
            userRole: 'def'
        }, { new: true });
        if (!updatedUser)
            return res.status(404).json({ message: "Користувача не знайдено" });
        const newToken = jsonwebtoken_1.default.sign({ id: updatedUser._id, role: 'def' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.status(200).json({ message: "підписку скасовано.", token: newToken, role: 'def' });
    }
    catch (err) {
        res.status(500).json({ message: "помилка при скасуванні підписки" });
    }
};
exports.cancelPremium = cancelPremium;
//# sourceMappingURL=userController.js.map