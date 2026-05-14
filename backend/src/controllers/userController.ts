import { Request, Response } from 'express';
import { User } from '../models/User';
import { type UserAuthRequest } from '../middleware/authCheck';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getProfile = async (req: UserAuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'користувача не знайдено' });

        res.status(200).json({ message: 'профіль отримано', user });

    } catch (err) {
        res.status(500).json({ message: 'помилка при отриманні даних профілю.' });
    }
};

export const updateProfile = async (req: UserAuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { 
            email, password, vaga, zrist, vik, stat, 
            activity, goal, calories, bilky, zhyry, vuglevody 
        } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'користувача не знайдено' });
        if (email) user.email = email;

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
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({ message: 'профіль та цілі оновлено' });

    } catch (err) {
        res.status(500).json({ message: "помилка при оновленні профілю" });
    }
};

export const buyPremium = async (req: UserAuthRequest, res: Response) => {
    try {
        const { cardNumber, expiryDate, cardHolder, cvv } = req.body;
        const userId = req.userId;
        if (!cardNumber || !cvv) {
            return res.status(400).json({ message: "введіть коректні дані картки" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                userRole: 'premium',
                cardData: { cardNumber, expiryDate, cardHolder }
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "користувача не знайдено" });

        const newToken = jwt.sign(
            { id: updatedUser._id, role: 'premium' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: "підписку оформлено успішно.", token: newToken, role: 'premium' });

    } catch (err) {
        res.status(500).json({ message: "помилка при оплаті" });
    }
};

export const cancelPremium = async (req: UserAuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                userRole: 'def'
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "Користувача не знайдено" });
        const newToken = jwt.sign(
            { id: updatedUser._id, role: 'def' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: "підписку скасовано.", token: newToken, role: 'def' });
        
    } catch (err) {
        res.status(500).json({ message: "помилка при скасуванні підписки" });
    }
};