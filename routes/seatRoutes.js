import express from 'express';
import seatController from '../controllers/seatController.js';

const router = express.Router();

// Assigned to ENZO //

/* READ */
router.get('/', seatController.getSeats);
router.get('/:id', seatController.getSeatById);

/* CREATE */
router.post('/', seatController.createSeat);

/* UPDATE */
router.put('/:id', seatController.updateSeat);

/* DELETE */
router.delete('/:id', seatController.deleteSeat);

export default router;
