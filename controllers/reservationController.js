import {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation
} from '../database/models/Reservation.js';

/* =============================== */
/* READ */
/* =============================== */
const handleGetReservations = async (req, res) => {
    try {
        const filter = req.query || {};
        const reservations = await getReservations(filter);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const handleCreateReservation = async (req, res) => {
    try {
        const newReservation = await createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error creating reservation', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const handleUpdateReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReservation = await updateReservation(id, req.body);
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
const handleDeleteReservation = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReservation = await deleteReservation(id);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting reservation', details: error.message });
    }
};

export default {
    handleGetReservations,
    handleCreateReservation,
    handleUpdateReservation,
    handleDeleteReservation
};
