import express from 'express';
import labController from '../controllers/labController.js';
import seatController from '../controllers/seatController.js';

const router = express.Router();

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', labController.getLabs);
router.get('/labs/:id', labController.getLabById);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', seatController.getSeatsInLab);
router.get('/labs/:labId/seats/:seatId', seatController.getSeatInLabById);

export default router;
