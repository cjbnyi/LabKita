import express from 'express';
import { adminPanelController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/admin/admin-panel', (req, res) => {
    res.status(200).render('admin', { title : 'Admin Panel' })
});

export default router;
