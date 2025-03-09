import express from 'express';
import { adminPanelController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/admin/admin-panel', adminPanelController.getAdminPanel);

export default router;
