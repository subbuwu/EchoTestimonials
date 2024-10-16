import { Router } from 'express';
import { getAllSpacesByUser, getAllUsers } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// // Endpoint to retrieve all users
router.get('/',verifyToken, getAllUsers);

router.get('/:userId/spaces',verifyToken,getAllSpacesByUser)

export default router;
