import { Reservation } from '../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getReservations = async (req, res) => {
    try {
        const filter = req.query || {};  // Extract query parameters as filter
        const reservations = await Reservation.getAllReservations(filter);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error creating reservation', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReservation = await Reservation.updateReservation(id, req.body);
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error updating reservation', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReservation = await Reservation.deleteReservation(id);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting reservation', details: error.message });
    }
};

export default {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation
};
