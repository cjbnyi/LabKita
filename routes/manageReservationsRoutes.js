import express from 'express';
import { manageReservationController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/manage-reservations', (req, res) => {
    res.render('manage-reservations', { title: "Manage Reservations" });
});

router.get('/manage-reservations/edit', manageReservationController.getEditReservationPage);

router.get('/manage-reservations/create', (req, res) => {
    res.render('reserve-slot', { 
        title: "Reserve Slot"
    });
});

export default router;
