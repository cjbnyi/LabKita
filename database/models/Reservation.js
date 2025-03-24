import { Schema, model } from 'mongoose';

const ReservationSchema = new Schema({
    seatIDs: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Seat', 
        required: true,
        validate: [
            {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                },
                message: 'At least one seat ID must be provided.'
            },
            {
                validator: function (value) {
                    return new Set(value.map(String)).size === value.length;
                },
                message: 'Seat IDs must be unique.'
            }
        ]
    }],
    startDateTime: { 
        type: Date, 
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Start time must be in the future.'
        }
    },
    endDateTime: { 
        type: Date, 
        required: true,
        validate: {
            validator: function (value) {
                return this.startDateTime && value > this.startDateTime;
            },
            message: 'End time must be later than start time.'
        }
    },
    creditedStudentIDs: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Student',
        validate: [
            {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                },
                message: 'At least one credited student ID must be provided.'
            },
            {
                validator: function (value) {
                    return new Set(value.map(String)).size === value.length;
                },
                message: 'Credited student IDs must be unique.'
            }
        ]
    }],
    purpose: { type: String, maxlength: 200 },
    status: { type: String, enum: ['Reserved', 'Cancelled', 'Completed'], default: 'Reserved' },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure number of seatIDs equals number of creditedStudentIDs
ReservationSchema.pre('validate', function (next) {
    if ((this.seatIDs?.length || 0) !== (this.creditedStudentIDs?.length || 0)) {
        return next(new Error('Number of seat IDs must equal number of credited student IDs.'));
    }
    if (this.startDateTime >= this.endDateTime) {
        return next(new Error('End time must be later than start time.'));
    }
    next();
});

export default class Reservation {
    static model = model('Reservation', ReservationSchema);

    static async getReservations(filter = {}) {
        try {
            return await this.model.find(filter)
                .populate('seatIDs')
                .populate('creditedStudentIDs')
                .sort({ startDateTime: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Reservation documents:", error);
            throw new Error(`Error fetching reservations: ${error.message}`);
        }
    }

    static async createReservation(reservationData) {
        try {
            const newReservation = await this.model.create(reservationData);
            return newReservation.toObject();
        } catch (error) {
            console.error("Error creating Reservation document:", error);
            throw new Error(`Error creating reservation: ${error.message}`);
        }
    }

    static async updateReservation(id, reservationData) {
        try {
            const reservation = await this.model.findByIdAndUpdate(id, reservationData, { new: true, runValidators: true });
            if (!reservation) throw new Error('Reservation not found');
            return reservation.toObject();
        } catch (error) {
            console.error("Error updating Reservation document by id:", error);
            throw new Error(`Error updating reservation: ${error.message}`);
        }
    }

    static async deleteReservation(id) {
        try {
            const reservation = await this.model.findByIdAndDelete(id);
            if (!reservation) throw new Error('Reservation not found');
            return reservation.toObject();
        } catch (error) {
            console.error("Error deleting Reservation document by id:", error);
            throw new Error(`Error deleting reservation: ${error.message}`);
        }
    }
}
