import express from 'express';
import { labController, seatController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/labs', labController.getLabs);
router.get('/labs/:labId/seats', seatController.getSeats);

export default router;
