import express from 'express';
import { labController, seatController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/labs', labController.handleGetLabs);
router.get('/labs/:labId/seats', seatController.handleGetSeats);

export default router;
