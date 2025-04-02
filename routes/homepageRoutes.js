import express from 'express';
import { tokenRefreshMiddleware } from '../middleware/authMiddleware.js';
import { checkValidation } from '../middleware/validationMiddleware.js';
import { homepageController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/',
    tokenRefreshMiddleware,
    checkValidation,
    homepageController.renderIndex
);

router.get('/about',
    tokenRefreshMiddleware,
    checkValidation,
    homepageController.renderAboutUs
);

export default router;
