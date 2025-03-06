import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Assigned to CJ //

/* READ */
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);

/* CREATE */
router.post('/', adminController.createAdmin);

/* UPDATE */
router.put('/:id', adminController.updateAdmin);

/* DELETE */
router.delete('/:id', adminController.deleteAdmin);

export default router;
