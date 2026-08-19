import { Router } from 'express';
import { login, verifyToken, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/verify', verifyToken);
router.get('/profile', authenticateToken, getProfile);

export default router;
