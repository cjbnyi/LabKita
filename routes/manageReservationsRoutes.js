import express from 'express';
import { manageReservationController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/manage-reservations', manageReservationController.viewManageReservations);
router.get('/manage-reservations/edit', manageReservationController.getEditReservationPage);
router.get('/manage-reservations/create', manageReservationController.getCreateReservationPage);

export default router;
