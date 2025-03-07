import reservationModel from '../database/models/Reservation.js';

/* ====================================== */
/* GENERAL RESERVATIONS */
/* ====================================== */

/* =============================== */
/* READ */
/* =============================== */
const getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations' });
    }
};

const getReservationById = async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await reservationModel.getReservationById(id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservation by ID' });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createReservation = async (req, res) => {
    const reservationData = req.body;

    try {
        const newReservation = await reservationModel.createReservation(reservationData);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error creating reservation' });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateReservation = async (req, res) => {
    const { id } = req.params;
    const reservationData = req.body;

    try {
        const updatedReservation = await reservationModel.updateReservation(id, reservationData);
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error updating reservation' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReservation = await reservationModel.deleteReservation(id);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting reservation' });
    }
};

/* ====================================== */
/* RESERVATIONS BY SEAT */
/* ====================================== */

/* =============================== */
/* READ */
/* =============================== */
const getReservationsForSeat = async (req, res) => {
    const { labId, seatId } = req.params;

    try {
        const reservations = await reservationModel.getReservationsForSeat(seatId);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations for seat' });
    }
};

const getReservationForSeatById = async (req, res) => {
    const { labId, seatId, reservationId } = req.params;

    try {
        const reservation = await reservationModel.getReservationForSeatById(seatId, reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservation for seat by ID' });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createReservationForSeat = async (req, res) => {
    const { labId, seatId } = req.params;
    const reservationData = req.body;

    try {
        const newReservation = await reservationModel.createReservationForSeat(seatId, reservationData);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error creating reservation for seat' });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateReservationForSeat = async (req, res) => {
    const { labId, seatId, reservationId } = req.params;
    const reservationData = req.body;

    try {
        const updatedReservation = await reservationModel.updateReservationForSeat(seatId, reservationId, reservationData);
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ error: 'Error updating reservation for seat' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservationFromSeat = async (req, res) => {
    const { labId, seatId, reservationId } = req.params;

    try {
        const deletedReservation = await reservationModel.deleteReservationFromSeat(seatId, reservationId);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting reservation from seat' });
    }
};

export default {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationsForSeat,
    getReservationForSeatById,
    createReservationForSeat,
    updateReservationForSeat,
    deleteReservationFromSeat
};
