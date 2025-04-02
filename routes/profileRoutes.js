import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { profileController, studentController } from '../controllers/controllers.js';
import { checkValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/profile/me',
    authenticateToken,
    checkValidation,
    profileController.renderProfile
);

router.get("/profile/:universityId",
    authenticateToken,
    checkValidation,
    profileController.renderProfile
);

router.get('/profile/me/update',
    authenticateToken,
    checkValidation,
    profileController.renderEditProfile
);

router.put('/profile/me/update',
    authenticateToken,
    checkValidation,
    studentController.updateStudent
);

router.get('/profile/me/privacy',
    authenticateToken,
    checkValidation,
    profileController.renderPrivacySettings
);

router.put('/profile/me/privacy',
    authenticateToken,
    checkValidation,
    studentController.updateStudent
);

router.delete('/profile/me/privacy',
    authenticateToken,
    checkValidation,
    studentController.deleteStudent
);

export default router;
