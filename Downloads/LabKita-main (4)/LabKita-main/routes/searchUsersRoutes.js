import express from 'express';
import { searchUsersController } from '../controllers/controllers.js';
import { checkValidation, validateMongoId } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/search-users',
    checkValidation,
    searchUsersController.getSearchUsersPage
);

router.get('/profile/:userId',
    checkValidation,
    validateMongoId('userId'),
    searchUsersController.getProfilePage
);

export default router;
