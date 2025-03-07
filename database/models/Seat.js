import { Schema, model } from 'mongoose';

const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

const seatModel = model('Seat', SeatSchema);

/* =============================== */
/* READ */
/* =============================== */
const getSeatsInLab = async (labId) => {
    try {
        return await seatModel.find({ labID: labId })
            .sort({ seatNumber: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching seats in lab:", error);
        throw error;
    }
};

const getSeatInLabById = async (labId, seatId) => {
    try {
        return await seatModel.findOne({ _id: seatId, labID: labId })
            .lean();
    } catch (error) {
        console.error("Error fetching seat in lab by ID:", error);
        throw error;
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createSeat = async (labId, seatData) => {
    try {
        const newSeat = new seatModel({ ...seatData, labID: labId });
        await newSeat.save();
        return newSeat.toObject();
    } catch (error) {
        console.error("Error creating seat:", error);
        throw error;
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateSeat = async (labId, seatId, seatData) => {
    try {
        const seat = await seatModel.findOneAndUpdate(
            { _id: seatId, labID: labId },
            seatData,
            { new: true }
        );
        return seat ? seat.toObject() : null;
    } catch (error) {
        console.error("Error updating seat:", error);
        throw error;
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteSeat = async (labId, seatId) => {
    try {
        const seat = await seatModel.findOneAndDelete({ _id: seatId, labID: labId });
        return seat ? seat.toObject() : null;
    } catch (error) {
        console.error("Error deleting seat:", error);
        throw error;
    }
};

export default {
    getSeatsInLab,
    getSeatInLabById,
    createSeat,
    updateSeat,
    deleteSeat
};
