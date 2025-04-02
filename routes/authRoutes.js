import express from 'express';
import { tokenRefreshMiddleware } from '../middleware/authMiddleware.js';
import { checkValidation } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/auth/signup',
    tokenRefreshMiddleware,
    checkValidation,
    authController.renderSignup
);

router.post('/auth/signup',
    tokenRefreshMiddleware,
    checkValidation,
    authController.signup
);

router.get('/auth/login',
    tokenRefreshMiddleware,
    checkValidation,
    authController.renderLogin
)

router.post('/auth/login',
    tokenRefreshMiddleware,
    checkValidation,
    authController.login
);

router.post('/auth/logout',
    authenticateToken,
    checkValidation,
    authController.logout
);

export default router;
