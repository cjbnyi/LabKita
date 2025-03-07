import { Schema, model } from 'mongoose';

const ReservationSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatID: { type: Schema.Types.ObjectId, ref: 'Seat', required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    requestingStudentID: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    creditedStudentIDs: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    purpose: { type: String, maxlength: 200 },
    status: { type: String, enum: ['Reserved', 'Cancelled', 'Completed'], default: 'Reserved' },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

const reservationModel = model('Reservation', ReservationSchema);

/* ====================================== */
/* GENERAL RESERVATIONS */
/* ====================================== */

/* =============================== */
/* READ */
/* =============================== */
const getAllReservations = async () => {
    try {
        return await reservationModel.find()
            .sort({ startDateTime: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Reservation documents:", error);
        throw error;
    }
};

const getReservationById = async (id) => {
    try {
        return await reservationModel.findById(id).lean();
    } catch (error) {
        console.error("Error fetching Reservation document by id:", error);
        throw error;
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createReservation = async (reservationData) => {
    try {
        const newReservation = new reservationModel(reservationData);
        await newReservation.save();
        return newReservation.toObject();
    } catch (error) {
        console.error("Error creating Reservation document:", error);
        throw error;
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateReservation = async (id, reservationData) => {
    try {
        const reservation = await reservationModel.findByIdAndUpdate(id, reservationData, { new: true });
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error updating Reservation document by id:", error);
        throw error;
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservation = async (id) => {
    try {
        const reservation = await reservationModel.findByIdAndDelete(id);
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error deleting Reservation document by id:", error);
        throw error;
    }
};

/* ====================================== */
/* RESERVATIONS BY SEAT */
/* ====================================== */

/* =============================== */
/* READ */
/* =============================== */
const getReservationsForSeat = async (seatId) => {
    try {
        return await reservationModel.find({ seatID: seatId }).sort({ startDateTime: 1 }).lean();
    } catch (error) {
        console.error("Error fetching Reservations for seat:", error);
        throw error;
    }
};

const getReservationForSeatById = async (seatId, reservationId) => {
    try {
        return await reservationModel.findOne({ _id: reservationId, seatID: seatId }).lean();
    } catch (error) {
        console.error("Error fetching Reservation for seat by ID:", error);
        throw error;
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createReservationForSeat = async (seatId, reservationData) => {
    try {
        const newReservation = new reservationModel({ ...reservationData, seatID: seatId });
        await newReservation.save();
        return newReservation.toObject();
    } catch (error) {
        console.error("Error creating Reservation for seat:", error);
        throw error;
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateReservationForSeat = async (seatId, reservationId, reservationData) => {
    try {
        const reservation = await reservationModel.findOneAndUpdate(
            { _id: reservationId, seatID: seatId },
            reservationData,
            { new: true }
        );
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error updating Reservation for seat:", error);
        throw error;
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteReservationFromSeat = async (seatId, reservationId) => {
    try {
        const reservation = await reservationModel.findOneAndDelete({ _id: reservationId, seatID: seatId });
        return reservation ? reservation.toObject() : null;
    } catch (error) {
        console.error("Error deleting Reservation from seat:", error);
        throw error;
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
