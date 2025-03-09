import express from 'express';
import { seatController, viewLabsController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/view-labs', viewLabsController.getViewLabsPage);
router.get('/view-labs/form', viewLabsController.getAvailableSeatsForm);
router.post('/view-labs/form', seatController.getSeats);
router.get('/view-labs/available-seats', viewLabsController.getAvailableSeatsPage);

export default router;
