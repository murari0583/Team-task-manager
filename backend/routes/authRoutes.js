import express from 'express';
import { authUser, registerUser, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/users').get(protect, getUsers);

export default router;
