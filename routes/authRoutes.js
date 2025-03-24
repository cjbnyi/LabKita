import express from 'express';
import { checkValidation } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/auth/signup',
    checkValidation,
    authController.renderSignup
);

router.post('/auth/signup',
    checkValidation,
    authController.signup
);

router.get('/auth/login',
    checkValidation,
    authController.renderLogin
)

router.post('/auth/login',
    checkValidation,
    authController.login
);

router.post('/auth/logout',
    authenticateToken,
    checkValidation,
    authController.logout
);

router.post('/auth/refresh',
    checkValidation,
    authController.refreshToken
);

export default router;
