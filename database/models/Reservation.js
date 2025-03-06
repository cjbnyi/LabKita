import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Assigned to ENZO //

// Reservation Schema
const ReservationSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatIDs: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    requestingStudentID: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    creditedStudentIDs: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    purpose: { type: String, maxlength: 200 },
    status: { type: String, enum: ['Reserved', 'Cancelled', 'Completed'], default: 'Reserved' },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

const reservationModel = model('Reservation', ReservationSchema);

/* READ */
const getAll = async () => {
    try {
        return await reservationModel.find()
            .sort({ _id: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Reservation documents:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        return await reservationModel.findById(id)
            .lean();
    } catch (error) {
        console.error("Error fetching Reservation document by id:", error);
        throw error;
    }
};

/* CREATE */
const create = async (reservationData) => {
    try {
        const newReservation = new reservationModel(reservationData);
        await newReservation.save();
        return newReservation.toObject();
    } catch (error) {
        console.error("Error creating Reservation document:", error);
        throw error;
    }
};

/* UPDATE */
const updateById = async (id, reservationData) => {
    try {
        const reservation = await reservationModel.findByIdAndUpdate(id, reservationData, { new: true });
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error updating Reservation document by id:", error);
        throw error;
    }
};

/* DELETE */
const deleteById = async (id) => {
    try {
        const reservation = await reservationModel.findByIdAndDelete(id);
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error deleting Reservation document by id:", error);
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
