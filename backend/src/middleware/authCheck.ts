import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserAuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const perevirkaAuth = (req: UserAuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'неавторізований' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.userId = decoded.id;
        req.userRole = decoded.role; 
        next(); 

    } catch (err) {
        return res.status(401).json({ message: 'невалідний токен' });
    }
}; 

export const checkRole = (allowedRoles: string[]) => {
    return (req: UserAuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole) {
            return res.status(404).json({ message: 'роль користувача не знайдена' });
        }

        if (allowedRoles.includes(req.userRole)) {
            next(); 
        } else {
            return res.status(403).json({ 
                message: 'доступ заборонено' 
            });
        }
    };
};