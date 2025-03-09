import express from 'express';
import { authController } from '../controllers/controllers.js';

const router = express.Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

export default router;
