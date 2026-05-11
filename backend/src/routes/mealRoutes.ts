import { Router } from 'express';
import * as mealController from '../controllers/mealController';
import { perevirkaAuth } from '../middleware/authCheck';

const router = Router();
router.post('/add', perevirkaAuth, mealController.addMealRecord);
router.post('/add-recipe', perevirkaAuth, mealController.addRecipeToDiary);
router.get('/stats', perevirkaAuth, mealController.getStatistics);
router.get('/history', perevirkaAuth, mealController.getHistory);
router.put('/:id', perevirkaAuth, mealController.updateMealRecord);
router.delete('/:id', perevirkaAuth, mealController.deleteMealRecord);

export default router;