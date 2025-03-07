import seatModel from '../database/models/Seat.js';

/* =============================== */
/* READ */
/* =============================== */
const getSeatsInLab = async (req, res) => {
    const { labId } = req.params;

    try {
        const seats = await seatModel.getSeatsInLab(labId);
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching seats in lab' });
    }
};

const getSeatInLabById = async (req, res) => {
    const { labId, seatId } = req.params;

    try {
        const seat = await seatModel.getSeatInLabById(labId, seatId);
        if (!seat) {
            return res.status(404).json({ error: 'Seat not found in the specified lab' });
        }
        res.status(200).json(seat);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching seat in lab by ID' });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createSeat = async (req, res) => {
    const { labId } = req.params;
    const seatData = req.body;

    try {
        const newSeat = await seatModel.createSeat(labId, seatData);
        res.status(201).json(newSeat);
    } catch (error) {
        res.status(500).json({ error: 'Error creating seat' });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateSeat = async (req, res) => {
    const { labId, seatId } = req.params;
    const seatData = req.body;

    try {
        const updatedSeat = await seatModel.updateSeat(labId, seatId, seatData);
        if (!updatedSeat) {
            return res.status(404).json({ error: 'Seat not found in the specified lab' });
        }
        res.status(200).json(updatedSeat);
    } catch (error) {
        res.status(500).json({ error: 'Error updating seat' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteSeat = async (req, res) => {
    const { labId, seatId } = req.params;

    try {
        const deletedSeat = await seatModel.deleteSeat(labId, seatId);
        if (!deletedSeat) {
            return res.status(404).json({ error: 'Seat not found in the specified lab' });
        }
        res.status(200).json({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting seat' });
    }
};

export default {
    getSeatsInLab,
    getSeatInLabById,
    createSeat,
    updateSeat,
    deleteSeat
};
