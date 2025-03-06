import express from 'express';
import labController from '../controllers/labController.js';

const router = express.Router();

// Assigned to ENZO //

/* READ */
router.get('/', labController.getLabs);
router.get('/:id', labController.getLabById);

/* CREATE */
router.post('/', labController.createLab);

/* UPDATE */
router.put('/:id', labController.updateLab);

/* DELETE */
router.delete('/:id', labController.deleteLab);

export default router;
