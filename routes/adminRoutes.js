import express from 'express';

import {
    validateMongoId,
    validateUserFields,
    checkValidation
} from '../middleware/validationMiddleware.js';

import {
    adminController,
    studentController,
    labController,
    seatController,
    reservationController
} from '../controllers/controllers.js';

const router = express.Router();

/* =============================== */
/* ADMIN */
/* =============================== */
router.get('/', checkValidation, adminController.getAdmins);
router.post('/', ...validateUserFields(), checkValidation, adminController.createAdmin);
router.put('/:id', validateMongoId, ...validateUserFields(), checkValidation, adminController.updateAdmin);
router.delete('/:id', validateMongoId, checkValidation, adminController.deleteAdmin);

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students', checkValidation, studentController.getStudents);
router.post('/students', ...validateUserFields(), checkValidation, studentController.createStudent);
router.put('/students/:id', validateMongoId, ...validateUserFields(), checkValidation, studentController.updateStudent);
router.delete('/students/:id', validateMongoId, checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.getLabs);
router.post('/labs', checkValidation, labController.createLab);
router.put('/labs/:id', validateMongoId, checkValidation, labController.updateLab);
router.delete('/labs/:id', validateMongoId, checkValidation, labController.deleteLab);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', validateMongoId, checkValidation, seatController.getSeats);
router.post('/labs/:labId/seats', validateMongoId, checkValidation, seatController.createSeat);
router.put('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.updateSeat);
router.delete('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.deleteSeat);

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
router.post('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.createReservation);
router.put('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.updateReservation);
router.delete('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.deleteReservation);

export default router;
