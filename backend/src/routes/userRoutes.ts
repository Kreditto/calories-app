import { Router } from 'express';
import * as userController from '../controllers/userController';
import { perevirkaAuth, checkRole } from '../middleware/authCheck';

const router = Router();
router.get('/', perevirkaAuth, userController.getProfile);
router.put('/', perevirkaAuth, userController.updateProfile);
router.post('/buy-premium', perevirkaAuth, userController.buyPremium);
router.post('/cancel-premium', perevirkaAuth, checkRole(['premium']), userController.cancelPremium);

export default router;