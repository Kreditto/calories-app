import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { perevirkaAuth, checkRole} from '../middleware/authCheck';

const router = Router();
router.get('/all-food', perevirkaAuth, checkRole(['admin']), adminController.getAllFood);
router.delete('/delete-food/:id', perevirkaAuth, checkRole(['admin']), adminController.deleteFood);
router.post('/create-food', perevirkaAuth, checkRole(['admin']), adminController.CreateFood);
router.put('/food/:id', perevirkaAuth, checkRole(['admin']), adminController.updateFood);

router.get('/all-recipes', perevirkaAuth, checkRole(['admin']), adminController.getAllRecipes);
router.get('/pending-recipes', perevirkaAuth, checkRole(['admin']), adminController.getPendingRecipe);
router.patch('/approve-recipe/:id', perevirkaAuth, checkRole(['admin']), adminController.approveRecipe);
router.delete('/delete-recipe/:id', perevirkaAuth, checkRole(['admin']), adminController.deleteRecipe);
router.post('/create-recipe', perevirkaAuth, checkRole(['admin']), adminController.createRecipe);

router.get('/stats', perevirkaAuth, checkRole(['admin']), adminController.getAdminStats);

export default router;