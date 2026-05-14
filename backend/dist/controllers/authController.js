"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const { login, email, password } = req.body;
        const exists = await User_1.User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Email вже зайнятий' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashPassword = await bcryptjs_1.default.hash(password, salt);
        const userRole = 'def';
        const NewUser = new User_1.User({
            login,
            email,
            password: hashPassword,
            userRole
        });
        await NewUser.save();
        res.status(201).json({ message: 'користувача створено успішно' });
    }
    catch (err) {
        res.status(500).json({ message: 'помилка при створенні користувача' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const korystuvach = await User_1.User.findOne({ email });
        if (!korystuvach) {
            return res.status(404).json({ message: 'користувача не знайдено.' });
        }
        const validPassword = await bcryptjs_1.default.compare(password, korystuvach.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'невірний пароль.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: korystuvach._id, role: korystuvach.userRole }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(200).json({ message: 'вхід успішний', token, role: korystuvach.userRole });
    }
    catch (err) {
        res.status(500).json({ message: 'помилка при вході' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map