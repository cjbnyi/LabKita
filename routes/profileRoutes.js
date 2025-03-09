import express from 'express';
import { studentController } from '../controllers/controllers.js';

const router = express.Router();

router.delete('/profile/me', studentController.deleteStudent);
router.put('/profile/me', studentController.updateStudent);

export default router;
