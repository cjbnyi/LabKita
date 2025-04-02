import express from 'express';

import {
    seatController,
    viewLabsController
} from '../controllers/controllers.js';

import {
    checkValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/view-labs',
    checkValidation,
    viewLabsController.getViewLabsPage
);

router.get('/view-labs/form',
    checkValidation,
    viewLabsController.getAvailableSeatsForm
);

router.post('/view-labs/form',
    checkValidation,
    seatController.getSeats
);

// TODO: Is this still a valid route?
router.get('/view-labs/available-seats',
    checkValidation,
    viewLabsController.getAvailableSeatsPage
);

export default router;
