import express from 'express';
import { manageReservationController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/manage-reservations', manageReservationController.getManageReservations);

router.get('/manage-reservations/edit/:reservationId', manageReservationController.getEditReservationPage);

router.get('/manage-reservations/create', (req, res) => {
    res.render('reserve-slot', { 
        title: "Reserve Slot"
    });
});

export default router;
