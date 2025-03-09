// TODO: Finalize!

import { Lab, Reservation, Seat } from '../../database/models/models.js';

const getViewLabsPage = async (req, res) => {
    try {
        const labs = await Lab.find();
        const reservations = await Reservation.find();
        res.render('viewLabs', { labs, reservations });
    } catch (error) {
        res.status(500).json({ error: 'Error loading view labs page' });
    }
};

const getAvailableSeatsForm = (req, res) => {
    try {
        res.render('availableSeatsForm');
    } catch (error) {
        res.status(500).json({ error: 'Error loading available seats form' });
    }
};

const getAvailableSeatsPage = async (req, res) => {
    try {
        const seats = await Seat.find();
        res.render('availableSeats', { seats });
    } catch (error) {
        res.status(500).json({ error: 'Error loading available seats page' });
    }
};

export default {
    getViewLabsPage,
    getAvailableSeatsForm,
    getAvailableSeatsPage
};
