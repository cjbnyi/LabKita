import express from 'express';
import { tokenRefreshMiddleware } from '../middleware/authMiddleware.js';
import { searchUsersController } from '../controllers/controllers.js';
import { checkValidation, validateMongoId } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/search-users',
    tokenRefreshMiddleware,
    checkValidation,
    searchUsersController.getSearchUsersPage
);

router.get('/profile/:userId',
    tokenRefreshMiddleware,
    checkValidation,
    validateMongoId('userId'),
    searchUsersController.getProfilePage
);

export default router;
