import express from 'express';
import { checkValidation, validateMongoId } from '../middleware/validationMiddleware.js';
import adminController from '../controllers/adminController.js';
import studentController from '../controllers/studentController.js';
import labController from '../controllers/labController.js';
import seatController from '../controllers/seatController.js';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

/* =============================== */
/* ADMIN */
/* =============================== */
router.get('/admins', checkValidation, adminController.getAdmins);
router.get('/admins/:id', validateMongoId, checkValidation, adminController.getAdminById);
router.post('/admins', ...validateUserFields(), checkValidation, adminController.createAdmin);
router.put('/admins/:id', validateMongoId, ...validateUserFields(), checkValidation, adminController.updateAdmin);
router.delete('/admins/:id', validateMongoId, checkValidation, adminController.deleteAdmin);

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students', checkValidation, studentController.getStudents);
router.get('/students/:id', validateMongoId, checkValidation, studentController.getStudentById);
router.post('/students', ...validateUserFields(), checkValidation, studentController.createStudent);
router.put('/students/:id', validateMongoId, ...validateUserFields(), checkValidation, studentController.updateStudent);
router.delete('/students/:id', validateMongoId, checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.getLabs);
router.get('/labs/:id', validateMongoId, checkValidation, labController.getLabById);
router.post('/labs', checkValidation, labController.createLab);
router.put('/labs/:id', validateMongoId, checkValidation, labController.updateLab);
router.delete('/labs/:id', validateMongoId, checkValidation, labController.deleteLab);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', validateMongoId, checkValidation, seatController.getSeatsInLab);
router.get('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.getSeatInLabById);
router.post('/labs/:labId/seats', validateMongoId, checkValidation, seatController.createSeat);
router.put('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.updateSeat);
router.delete('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.deleteSeat);

/* =============================== */
/* RESERVATION */
/* =============================== */
router.get('/reservations', checkValidation, reservationController.getAllReservations);
router.get('/reservations/:id', validateMongoId, checkValidation, reservationController.getReservationById);
router.post('/reservations', checkValidation, reservationController.createReservation);
router.put('/reservations/:id', validateMongoId, checkValidation, reservationController.updateReservation);
router.delete('/reservations/:id', validateMongoId, checkValidation, reservationController.deleteReservation);

/* =============================== */
/* RESERVATION BY SEAT */
/* =============================== */
router.get('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.getReservationsForSeat);
router.get('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.getReservationForSeatById);
router.post('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.createReservationForSeat);
router.put('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.updateReservationForSeat);
router.delete('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.deleteReservationFromSeat);

export default router;
