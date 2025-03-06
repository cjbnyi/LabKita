import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Assigned to ENZO //

// Seat Schema
const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

const seatModel = model('Seat', SeatSchema);

/* READ */
const getAll = async () => {
    try {
        return await seatModel.find()
            .sort({ labID: 1, seatNumber: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Seat documents:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        return await seatModel.findById(id)
            .lean();
    } catch (error) {
        console.error("Error fetching Seat document by id:", error);
        throw error;
    }
};

/* CREATE */
const create = async (seatData) => {
    try {
        const newSeat = new seatModel(seatData);
        await newSeat.save();
        return newSeat.toObject();
    } catch (error) {
        console.error("Error creating Seat document:", error);
        throw error;
    }
};

/* UPDATE */
const updateById = async (id, seatData) => {
    try {
        const seat = await seatModel.findByIdAndUpdate(id, seatData, { new: true });
        return seat ? seat.toObject() : null;
    } catch (error) {
        console.error("Error updating Seat document by id:", error);
        throw error;
    }
};

/* DELETE */
const deleteById = async (id) => {
    try {
        const seat = await seatModel.findByIdAndDelete(id);
        return seat ? seat.toObject() : null;
    } catch (error) {
        console.error("Error deleting Seat document by id:", error);
        throw error;
    }
};

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};
