import express from 'express';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

// Assigned to ENZO //

/* READ */
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);

/* CREATE */
router.post('/', reservationController.createReservation);

/* UPDATE */
router.put('/:id', reservationController.updateReservation);

/* DELETE */
router.delete('/:id', reservationController.deleteReservation);

export default router;
