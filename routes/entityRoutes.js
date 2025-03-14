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
router.get('/admins', checkValidation, adminController.getAdmins);
router.post('/admins', ...validateUserFields(), checkValidation, adminController.createAdmin);
router.put('/admins/:adminId', validateMongoId('adminId'), ...validateUserFields(), checkValidation, adminController.updateAdmin);
router.delete('/admins/:adminId', validateMongoId('adminId'), checkValidation, adminController.deleteAdmin);

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students', checkValidation, studentController.getStudents);
router.post('/students', ...validateUserFields(), checkValidation, studentController.createStudent);
router.put('/students/:studentId', validateMongoId('studentId'), ...validateUserFields(), checkValidation, studentController.updateStudent);
router.delete('/students/:studentId', validateMongoId('studentId'), checkValidation, studentController.deleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.getLabs);
router.post('/labs', checkValidation, labController.createLab);
router.put('/labs/:labId', validateMongoId('labId'), checkValidation, labController.updateLab);
router.delete('/labs/:labId', validateMongoId('labId'), checkValidation, labController.deleteLab);

/* =============================== */
/* SEAT */
/* =============================== */
router.get('/seats', checkValidation, seatController.getSeats);
router.post('/seats', checkValidation, seatController.createSeat);
router.put('/seats/:seatId', validateMongoId('seatId'), checkValidation, seatController.updateSeat);
router.delete('/seats/:seatId', validateMongoId('seatId'), checkValidation, seatController.deleteSeat);

/* =============================== */
/* RESERVATION */ 
/* =============================== */
router.get('/reservations', checkValidation, reservationController.getReservations);
router.post('/reservations', checkValidation, reservationController.createReservation);
router.put('/reservations/:reservationId', validateMongoId('reservationId'), checkValidation, reservationController.updateReservation);
router.delete('/reservations/:reservationId', validateMongoId('reservationId'), checkValidation, reservationController.deleteReservation);

export default router;
