import { Router } from 'express';
import * as recipeController from '../controllers/recipeController';
import { perevirkaAuth, checkRole } from '../middleware/authCheck';

const router = Router();

router.get('/', perevirkaAuth, checkRole(['premium']), recipeController.getAllRecipes);
router.post('/create', perevirkaAuth, checkRole(['premium']), recipeController.createRecipe);
export default router;