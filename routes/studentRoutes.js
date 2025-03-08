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
router.get('/:id', validateMongoId, checkValidation, studentController.handleGetStudents);
router.put('/:id', validateMongoId, checkValidation, studentController.handleUpdateStudent);
router.delete('/:id', validateMongoId, checkValidation, studentController.handleDeleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.handleGetLabs);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', validateMongoId, checkValidation, seatController.handleGetSeats);

/* =============================== */
/* RESERVATION */
/* =============================== */
router.get('/reservations', checkValidation, reservationController.handleGetReservations);
router.post('/reservations', checkValidation, reservationController.handleCreateReservation);
router.put('/reservations/:id', validateMongoId, checkValidation, reservationController.handleUpdateReservation);
router.delete('/reservations/:id', validateMongoId, checkValidation, reservationController.handleDeleteReservation);

/* =============================== */
/* RESERVATION BY SEAT */
/* =============================== */
router.get('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.handleGetReservations);

export default router;
