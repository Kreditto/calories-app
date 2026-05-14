"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.perevirkaAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const perevirkaAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'неавторізований' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'невалідний токен' });
    }
};
exports.perevirkaAuth = perevirkaAuth;
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(404).json({ message: 'роль користувача не знайдена' });
        }
        if (allowedRoles.includes(req.userRole)) {
            next();
        }
        else {
            return res.status(403).json({
                message: 'доступ заборонено'
            });
        }
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=authCheck.js.map