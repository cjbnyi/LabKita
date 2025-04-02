import { Lab, Seat } from '../../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getSeats = async (req, res) => {
    try {
        const filter = req.query || {};
        const seats = await Seat.getSeats(filter);
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching seats', details: error.message });
    }
};

const getLabSeats = async (req, res) => {
    try {
        const { labID } = req.query;

        if (!labID) {
            return res.status(400).json({ error: "Lab ID is required" });
        }

        console.log("Fetching seats for Lab ID:", labID);

        // Find the lab by its ID
        const lab = await Lab.model.findById(labID).exec();
        if (!lab) {
            return res.status(404).json({ error: "Lab not found" });
        }

        console.log("Found lab:", lab._id);

        // Find all seats belonging to the lab
        const seats = await Seat.model.find({ labID: lab._id }).exec();

        console.log("Seats found:", seats.length);
        res.status(200).json(seats);
    } catch (error) {
        console.error("Error fetching seats:", error);
        res.status(500).json({ error: "Error fetching seats", details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createSeat = async (req, res) => {
    try {
        const newSeat = await Seat.createSeat(req.body);
        res.status(201).json(newSeat);
    } catch (error) {
        res.status(500).json({ error: 'Error creating seat', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateSeat = async (req, res) => {
    const { seatId } = req.params;
    try {
        const updatedSeat = await Seat.updateSeat(seatId, req.body);
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
const deleteSeat = async (req, res) => {
    const { seatId } = req.params;
    try {
        const deletedSeat = await Seat.deleteSeat(seatId);
        if (!deletedSeat) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        res.status(200).json({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting seat', details: error.message });
    }
};

export default {
    getSeats,
    getLabSeats,
    createSeat,
    updateSeat,
    deleteSeat
};
