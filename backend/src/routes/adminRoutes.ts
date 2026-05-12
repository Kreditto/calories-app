import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { perevirkaAuth, checkRole} from '../middleware/authCheck';

const router = Router();
router.get('/food/pending', perevirkaAuth, checkRole(['admin']), adminController.getPendingFood);
router.patch('/food/:id/approve', perevirkaAuth, checkRole(['admin']), adminController.approveFood);
router.delete('/food/:id', perevirkaAuth, checkRole(['admin']), adminController.deleteFood);

router.get('/recipe/pending', perevirkaAuth, checkRole(['admin']), adminController.getPendingRecipe);
router.patch('/recipe/:id/approve', perevirkaAuth, checkRole(['admin']), adminController.approveRecipe);
router.delete('/recipe/:id', perevirkaAuth, checkRole(['admin']), adminController.deleteRecipe);

export default router;