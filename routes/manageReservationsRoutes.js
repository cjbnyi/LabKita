import express from 'express';
import { manageReservationController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/manage-reservations', manageReservationController.getManageReservations);

router.get('/manage-reservations/edit/:reservationId', manageReservationController.getEditReservationPage);

router.get('/manage-reservations/create', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/labs');
        const labs = await response.json();

        res.render('reserve-slot', { 
            title: "Reserve Slot",
            labsData: JSON.stringify(labs)
        });
    } catch (error) {
        console.error("Error fetching labs:", error);
        res.render('reserve-slot', { 
            title: "Reserve Slot",
            labsData: "[]"
        });
    }
});


export default router;
