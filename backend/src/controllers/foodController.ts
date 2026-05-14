import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { type UserAuthRequest } from '../middleware/authCheck';

export const searchFood = async (req: UserAuthRequest, res: Response) => {
    const query = req.query.q as string;
    if (!query || query.length < 2){
        return res.json([]);
    } 
    const products = await Food.find({
        name: { $regex: query, $options: 'i' }
    }).limit(15);

    res.json(products);
};
