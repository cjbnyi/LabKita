import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

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
router.get('/admins',
    authenticateToken,
    checkValidation,
    adminController.getAdmins
);

router.post('/admins',
    authenticateToken,
    ...validateUserFields(),
    checkValidation,
    adminController.createAdmin
);

router.put('/admins/:adminId',
    authenticateToken,
    validateMongoId('adminId'),
    ...validateUserFields(),
    checkValidation,
    adminController.updateAdmin
);

router.delete('/admins/:adminId',
    authenticateToken,
    validateMongoId('adminId'),
    checkValidation,
    adminController.deleteAdmin
);

/* =============================== */
/* STUDENT */
/* =============================== */
router.get('/students',
    checkValidation,
    studentController.getStudents
);

router.post('/students',
    authenticateToken,
    ...validateUserFields(),
    checkValidation,
    studentController.createStudent
);

router.post('/students/validate',
    authenticateToken,
    checkValidation,
    studentController.validateStudents
);

router.put('/students/:studentId',
    authenticateToken,
    validateMongoId('studentId'),
    ...validateUserFields(),
    checkValidation,
    studentController.updateStudent
);

router.delete('/students/:studentId',
    authenticateToken,
    validateMongoId('studentId'),
    checkValidation,
    studentController.deleteStudent
);

/* =============================== */
/* LAB */
/* =============================== */
router.get('/labs',
    checkValidation,
    labController.getLabs
);

router.post('/labs',
    authenticateToken,
    checkValidation,
    labController.createLab
);

router.put('/labs/:labId',
    authenticateToken,
    validateMongoId('labId'),
    checkValidation,
    labController.updateLab
);

router.delete('/labs/:labId',
    authenticateToken,
    validateMongoId('labId'),
    checkValidation,
    labController.deleteLab
);

/* =============================== */
/* SEAT */
/* =============================== */
router.get('/seats',
    authenticateToken,
    checkValidation,
    seatController.getSeats
);

router.get('/seats-by-lab',
    authenticateToken,
    checkValidation,
    seatController.getLabSeats
);

router.post('/seats',
    authenticateToken,
    checkValidation,
    seatController.createSeat
);

router.put('/seats/:seatId',
    authenticateToken,
    validateMongoId('seatId'),
    checkValidation,
    seatController.updateSeat
);

router.delete('/seats/:seatId',
    authenticateToken,
    validateMongoId('seatId'),
    checkValidation,
    seatController.deleteSeat
);

/* =============================== */
/* RESERVATION */ 
/* =============================== */
router.get('/reservations',
    checkValidation,
    reservationController.getReservations
);

router.get('/reservations/:reservationId',
    checkValidation,
    reservationController.getReservation
);

router.post('/reservations',
    authenticateToken,
    checkValidation,
    reservationController.createReservation
);

router.put('/reservations/:reservationId',
    authenticateToken,
    validateMongoId('reservationId'),
    checkValidation,
    reservationController.updateReservation
);

router.delete('/reservations/:reservationId',
    authenticateToken,
    validateMongoId('reservationId'),
    checkValidation,
    reservationController.deleteReservation
);

export default router;
