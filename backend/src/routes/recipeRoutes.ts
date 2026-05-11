import { Router } from 'express';
import * as recipeController from '../controllers/recipeController';
import { perevirkaAuth } from '../middleware/authCheck';

const router = Router();

router.get('/', perevirkaAuth, recipeController.getAllRecipes);
router.post('/create', perevirkaAuth, recipeController.createRecipe);
export default router;