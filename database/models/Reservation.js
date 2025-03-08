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

export const Reservation = model('Reservation', ReservationSchema);

/* =============================== */
/* CRUD OPERATIONS */
/* =============================== */
export const getReservations = async (filter = {}) => {
    try {
        return await Reservation.find(filter)
            .sort({ startDateTime: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching Reservation documents:", error);
        throw new Error('Error fetching reservations');
    }
};

export const createReservation = async (reservationData) => {
    try {
        const newReservation = new Reservation(reservationData);
        await newReservation.save();
        return newReservation.toObject();
    } catch (error) {
        console.error("Error creating Reservation document:", error);
        throw new Error('Error creating reservation');
    }
};

export const updateReservation = async (id, reservationData) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(id, reservationData, { new: true });
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return reservation.toObject();
    } catch (error) {
        console.error("Error updating Reservation document by id:", error);
        throw new Error('Error updating reservation');
    }
};

export const deleteReservation = async (id) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return reservation.toObject();
    } catch (error) {
        console.error("Error deleting Reservation document by id:", error);
        throw new Error('Error deleting reservation');
    }
};
