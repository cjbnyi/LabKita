import express from 'express';
import { checkValidation, validateMongoId } from '../middleware/validationMiddleware.js';
import studentController from '../controllers/studentController.js';
import labController from '../controllers/labController.js';
import seatController from '../controllers/seatController.js';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students/:id', validateMongoId, checkValidation, studentController.getStudentById);
router.put('/students/:id', validateMongoId, checkValidation, studentController.updateStudent);
router.delete('/students/:id', validateMongoId, checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/students/labs', checkValidation, labController.getLabs);
router.get('/students/labs/:id', validateMongoId, checkValidation, labController.getLabById);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/students/labs/:labId/seats', validateMongoId, checkValidation, seatController.getSeatsInLab);
router.get('/students/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.getSeatInLabById);

/* =============================== */
/* RESERVATION */
/* =============================== */
router.get('/students/reservations', checkValidation, reservationController.getStudentReservations);
router.get('/students/reservations/:id', validateMongoId, checkValidation, reservationController.getStudentReservationById);
router.post('/students/reservations', checkValidation, reservationController.createStudentReservation);
router.put('/students/reservations/:id', validateMongoId, checkValidation, reservationController.updateStudentReservation);
router.delete('/students/reservations/:id', validateMongoId, checkValidation, reservationController.cancelStudentReservation);

/* =============================== */
/* RESERVATION BY SEAT */
/* =============================== */
router.get('/students/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.getReservationsForSeat);
router.get('/students/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.getReservationForSeatById);

export default router;
