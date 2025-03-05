const router = require('express').Router();
const reservationController = require('../controllers/reservationController');

// Assigned to: 

/* READ */
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);

/* CREATE */
router.post('/', reservationController.createReservation);

/* UPDATE */
router.put('/:id', reservationController.updateReservation);

/* DELETE */
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
