import express from 'express';

import {
    validateMongoId,
    checkValidation
} from '../middleware/validationMiddleware.js';

import {
    studentController,
    labController,
    seatController,
    reservationController
} from '../controllers/controllers.js';

const router = express.Router();

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/', validateMongoId, checkValidation, studentController.getStudents);
router.put('/:id', validateMongoId, checkValidation, studentController.updateStudent);
router.delete('/:id', validateMongoId, checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.getLabs);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', validateMongoId, checkValidation, seatController.getSeats);

/* =============================== */
/* RESERVATION */
/* =============================== */
router.get('/reservations', checkValidation, reservationController.getReservations);
router.post('/reservations', checkValidation, reservationController.createReservation);
router.put('/reservations/:id', validateMongoId, checkValidation, reservationController.updateReservation);
router.delete('/reservations/:id', validateMongoId, checkValidation, reservationController.deleteReservation);

/* =============================== */
/* RESERVATION BY SEAT */
/* =============================== */
router.get('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.getReservations);

export default router;
