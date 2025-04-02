import express from 'express';
import { checkValidation } from '../middleware/validationMiddleware.js';
import { homepageController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/',
    checkValidation,
    homepageController.renderIndex
);

router.get('/about',
    checkValidation,
    homepageController.renderAboutUs
);

export default router;
