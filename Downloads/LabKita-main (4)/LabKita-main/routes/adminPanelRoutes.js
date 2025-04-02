import express from 'express';
import { checkValidation } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/authMiddleware.js';
import { adminPanelController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/admin/admin-panel',
    authenticateToken,
    authorizeRole('admin'),
    checkValidation,
    adminPanelController.getAdminPanel
);

export default router;
