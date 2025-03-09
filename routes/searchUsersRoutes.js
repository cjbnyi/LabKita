import express from 'express';
import { studentController, searchUsersController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/search-users', searchUsersController.getSearchUsersPage);
router.get('/profile/:userId', searchUsersController.getProfilePage);

export default router;
