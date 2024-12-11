import { Router } from 'express';
import { getAllSpacesByUser, getAllUsers } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// // Endpoint to retrieve all users
router.get('/',authMiddleware, getAllUsers);

router.get('/spaces',authMiddleware,getAllSpacesByUser)

export default router;
