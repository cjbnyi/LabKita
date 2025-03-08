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
router.get('/students/:id', validateMongoId, checkValidation, studentController.getStudents);
router.put('/students/:id', validateMongoId, checkValidation, studentController.updateStudent);
router.delete('/students/:id', validateMongoId, checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/students/labs', checkValidation, labController.getLabs);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/students/labs/:labId/seats', validateMongoId, checkValidation, seatController.getSeats);

/* =============================== */
/* RESERVATION */
/* =============================== */
router.get('/students/reservations', checkValidation, reservationController.getReservations);
router.post('/students/reservations', checkValidation, reservationController.createReservation);
router.put('/students/reservations/:id', validateMongoId, checkValidation, reservationController.updateReservation);
router.delete('/students/reservations/:id', validateMongoId, checkValidation, reservationController.deleteReservation);

/* =============================== */
/* RESERVATION BY SEAT */
/* =============================== */
router.get('/students/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.getReservations);

export default router;
