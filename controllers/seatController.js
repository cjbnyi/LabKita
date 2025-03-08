import {
    getSeats,
    createSeat,
    updateSeat,
    deleteSeat
} from '../database/models/Seat.js';

/* =============================== */
/* READ */
/* =============================== */
const handleGetSeats = async (req, res) => {
    try {
        const filter = req.query || {};
        const seats = await getSeats(filter);
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching seats', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const handleCreateSeat = async (req, res) => {
    try {
        const newSeat = await createSeat(req.body);
        res.status(201).json(newSeat);
    } catch (error) {
        res.status(500).json({ error: 'Error creating seat', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const handleUpdateSeat = async (req, res) => {
    const { seatId } = req.params;
    try {
        const updatedSeat = await updateSeat(seatId, req.body);
        if (!updatedSeat) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        res.status(200).json(updatedSeat);
    } catch (error) {
        res.status(500).json({ error: 'Error updating seat', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const handleDeleteSeat = async (req, res) => {
    const { seatId } = req.params;
    try {
        const deletedSeat = await deleteSeat(seatId);
        if (!deletedSeat) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        res.status(200).json({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting seat', details: error.message });
    }
};

export default {
    handleGetSeats,
    handleCreateSeat,
    handleUpdateSeat,
    handleDeleteSeat
};
