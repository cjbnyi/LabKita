import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { manageReservationController } from '../controllers/controllers.js';
import { checkValidation, validateMongoId } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/manage-reservations',
    authenticateToken,
    checkValidation,
    manageReservationController.getManageReservations
);

router.get('/manage-reservations/edit/:reservationId',
    authenticateToken,
    validateMongoId('reservationId'),
    checkValidation,
    manageReservationController.getEditReservationPage
);

router.get('/manage-reservations/create',
    authenticateToken,
    checkValidation,
    manageReservationController.renderCreateReservation
);


export default router;
