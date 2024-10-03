import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// Endpoint to retrieve all users
router.get('/',verifyToken, getAllUsers);

export default router;
