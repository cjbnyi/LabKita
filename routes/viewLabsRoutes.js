import express from 'express';
import {
    labController,
    seatController,
    viewLabsController
} from '../controllers/controllers.js';

const router = express.Router();

router.get('/view-labs', async (req, res) => {
    const response = await fetch('http://localhost:3000/api/labs');
    const labs = await response.json();
    const buildings = [...new Set(labs.map(lab => lab.building))];

    res.render('view-labs', { title: "View Labs", labs, buildings });
});

router.get('/view-labs/form', (req, res) => {
    res.render('view-seats', { title: "View Labs" });
});
router.post('/view-labs/form', seatController.getSeats);
router.get('/view-labs/available-seats', viewLabsController.getAvailableSeatsPage);

export default router;
