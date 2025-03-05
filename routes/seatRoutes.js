const router = require('express').Router();
const seatController = require('../controllers/seatController');

// Assigned to: 

/* READ */
router.get('/', seatController.getSeats);
router.get('/:id', seatController.getSeatById);

/* CREATE */
router.post('/', seatController.createSeat);

/* UPDATE */
router.put('/:id', seatController.updateSeat);

/* DELETE */
router.delete('/:id', seatController.deleteSeat);

module.exports = router;
