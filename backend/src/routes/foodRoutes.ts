import { Router } from 'express';
import * as foodController from '../controllers/foodController';
import { perevirkaAuth } from '../middleware/authCheck';

const router = Router();
router.get('/search', perevirkaAuth, foodController.searchFood);
router.post('/add', perevirkaAuth, foodController.addFoodToLibrary);

export default router;