import express from 'express';
import { seatController, viewLabsController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/view-labs', (req, res) => {
    res.render('view-labs', { title: "View Labs" });
});

router.get('/view-labs/form', (req, res) => {
    res.render('view-slot', { title: "View Labs" });
});
router.post('/view-labs/form', seatController.getSeats);
router.get('/view-labs/available-seats', viewLabsController.getAvailableSeatsPage);

export default router;
