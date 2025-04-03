import { Reservation } from '../../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getReservations = async (req, res) => {
    try {
        let { seatIDs } = req.query;

        if (!seatIDs) {
            return res.status(400).json({ error: "seatIDs query parameter is required" });
        }

        seatIDs = Array.isArray(seatIDs) ? seatIDs : seatIDs.split(",");

        // Fetch reservations that include any of the specified seat IDs
        const reservations = await Reservation.model.find({ seatIDs: { $in: seatIDs } })
            .populate("seatIDs")
            .populate("creditedStudentIDs")
            .sort({ startDateTime: 1 });

        const formattedReservations = reservations.map(reservation => ({
            ...reservation.toObject(),
            startDateTime: new Date(reservation.startDateTime).toLocaleString(), // Format to local date and time
            endDateTime: new Date(reservation.endDateTime).toLocaleString()      // Format to local date and time
        }));

        res.status(200).json(formattedReservations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reservations", details: error.message });
    }
};

const getReservation = async (req, res) => {
    const { reservationId } = req.params;  // Extract reservation ID from the URL parameters
    try {
        // Fetch the reservation from the database using the reservation ID
        const reservation = await Reservation.model.findById(reservationId)
            .populate("seatIDs")
            .populate("creditedStudentIDs");

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Return the reservation data
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reservation", details: error.message });
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
    const { reservationId } = req.params;
    try {
        const updatedReservation = await Reservation.updateReservation(reservationId, req.body);
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ success: true, updatedReservation });
    } catch (error) {
        res.status(500).json({ error: 'Error updating reservation', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservation = async (req, res) => {
    const { reservationId } = req.params;
    try {
        const deletedReservation = await Reservation.deleteReservation(reservationId);
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
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation
};
