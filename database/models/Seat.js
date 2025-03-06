import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Assigned to Enzo //

// Seat Schema
const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

export default model('Seat', SeatSchema);

/* READ */


/* CREATE */


/* UPDATE */


/* DELETE */

