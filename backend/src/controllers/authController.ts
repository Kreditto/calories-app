import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';


export const register = async (req: Request, res: Response) => {
    const { login, email, password} = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: 'Email вже зайнятий' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const UserRole = 'def';
    const NewUser = new User({
        login,
        email,
        password: hashPassword,
        UserRole
    });

    await NewUser.save();
    res.status(201).json({ message: 'користувача створено успішно' });
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const korystuvach = await User.findOne({ email });
    if (!korystuvach) {
        return res.status(404).json({ message: 'користувача не знайдено.' });
    }
    const validPassword = await bcrypt.compare(password, korystuvach.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'невірний пароль.' });
    }
    const token = jwt.sign(
        { id: korystuvach._id, role: korystuvach.UserRole },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
    );

    res.json({ token, role: korystuvach.UserRole });

};