import { Schema, model } from 'mongoose';

const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

export const Seat = model('Seat', SeatSchema);

/* =============================== */
/* CRUD OPERATIONS */
/* =============================== */
export const getSeats = async (filter = {}) => {
    try {
        return await Seat.find(filter)
            .sort({ seatNumber: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching Seat documents:", error);
        throw new Error('Error fetching seats');
    }
};

export const createSeat = async (seatData) => {
    try {
        const newSeat = new Seat(seatData);
        await newSeat.save();
        return newSeat.toObject();
    } catch (error) {
        console.error("Error creating seat:", error);
        throw new Error('Error creating seat');
    }
};

export const updateSeat = async (id, seatData) => {
    try {
        const seat = await Seat.findByIdAndUpdate(id, seatData);
        if (!seat) {
            throw new Error('Seat not found');
        }
        return seat.toObject();
    } catch (error) {
        console.error("Error updating seat:", error);
        throw new Error('Error updating seat');
    }
};

export const deleteSeat = async (id) => {
    try {
        const seat = await Seat.findByIdAndDelete(id);
        if (!seat) {
            throw new Error('Seat not found');
        }
        return seat.toObject();
    } catch (error) {
        console.error("Error deleting seat:", error);
        throw new Error('Error deleting seat');
    }
};
