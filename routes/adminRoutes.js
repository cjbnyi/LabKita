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
router.get('/', checkValidation, adminController.handleGetAdmins);
router.post('/', ...validateUserFields(), checkValidation, adminController.handleCreateAdmin);
router.put('/:id', validateMongoId, ...validateUserFields(), checkValidation, adminController.handleUpdateAdmin);
router.delete('/:id', validateMongoId, checkValidation, adminController.handleDeleteAdmin);

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students', checkValidation, studentController.handleGetStudents);
router.post('/students', ...validateUserFields(), checkValidation, studentController.handleCreateStudent);
router.put('/students/:id', validateMongoId, ...validateUserFields(), checkValidation, studentController.handleUpdateStudent);
router.delete('/students/:id', validateMongoId, checkValidation, studentController.handleDeleteStudent);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs', checkValidation, labController.handleGetLabs);
router.post('/labs', checkValidation, labController.handleCreateLab);
router.put('/labs/:id', validateMongoId, checkValidation, labController.handleUpdateLab);
router.delete('/labs/:id', validateMongoId, checkValidation, labController.handleDeleteLab);

/* =============================== */
/* SEAT BY LAB */
/* =============================== */
router.get('/labs/:labId/seats', validateMongoId, checkValidation, seatController.handleGetSeats);
router.post('/labs/:labId/seats', validateMongoId, checkValidation, seatController.handleCreateSeat);
router.put('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.handleUpdateSeat);
router.delete('/labs/:labId/seats/:seatId', validateMongoId, checkValidation, seatController.handleDeleteSeat);

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
router.post('/labs/:labId/seats/:seatId/reservations', validateMongoId, checkValidation, reservationController.handleCreateReservation);
router.put('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.handleUpdateReservation);
router.delete('/labs/:labId/seats/:seatId/reservations/:reservationId', validateMongoId, checkValidation, reservationController.handleDeleteReservation);

export default router;
