import { Schema, model } from 'mongoose';

const ReservationSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatIDs: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    requestingStudentID: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    creditedStudentIDs: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    purpose: { type: String, maxlength: 200 },
    status: { type: String, enum: ['Reserved', 'Cancelled', 'Completed'], default: 'Reserved' },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

export default class Reservation {
    static model = model('Reservation', ReservationSchema);

    static async getReservations(filter = {}) {
        try {
            return await this.model.find(filter)
                .populate("labID")
                .populate("seatIDs")
                .populate("requestingStudentID")
                .populate("creditedStudentIDs")
                .sort({ startDateTime: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Reservation documents:", error);
            throw new Error('Error fetching reservations');
        }
    }

    static async createReservation(reservationData) {
        try {
            const newReservation = new this.model(reservationData);
            await newReservation.save();
            return newReservation.toObject();
        } catch (error) {
            console.error("Error creating Reservation document:", error);
            throw new Error('Error creating reservation');
        }
    }

    static async updateReservation(id, reservationData) {
        try {
            const reservation = await this.model.findByIdAndUpdate(id, reservationData, { new: true });
            if (!reservation) throw new Error('Reservation not found');
            return reservation.toObject();
        } catch (error) {
            console.error("Error updating Reservation document by id:", error);
            throw new Error('Error updating reservation');
        }
    }

    static async deleteReservation(id) {
        try {
            const reservation = await this.model.findByIdAndDelete(id);
            if (!reservation) throw new Error('Reservation not found');
            return reservation.toObject();
        } catch (error) {
            console.error("Error deleting Reservation document by id:", error);
            throw new Error('Error deleting reservation');
        }
    }
}
