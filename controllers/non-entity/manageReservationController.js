// TODO: Finalize!

import { Reservation } from '../../database/models/models.js';

const viewManageReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('manageReservations', { reservations });
    } catch (error) {
        res.status(500).json({ error: 'Error loading reservations' });
    }
};

const getEditReservationPage = (req, res) => {
    try {
        res.render('editReservation');
    } catch (error) {
        res.status(500).json({ error: 'Error loading edit reservation page' });
    }
};

const getCreateReservationPage = (req, res) => {
    try {
        res.render('createReservation');
    } catch (error) {
        res.status(500).json({ error: 'Error loading create reservation page' });
    }
};

export default {
    viewManageReservations,
    getEditReservationPage,
    getCreateReservationPage
};
