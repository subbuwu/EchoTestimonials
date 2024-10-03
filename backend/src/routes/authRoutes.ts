import { Router } from 'express';
import { googleAuth } from '../controllers/authController';

const router = Router();

// Google authentication and JWT generation
router.post('/google', googleAuth);

export default router;
