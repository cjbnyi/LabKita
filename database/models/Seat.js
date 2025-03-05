const mongoose = require('mongoose');
const { Schema } = mongoose;

// Seat Schema
const SeatSchema = new Schema({
    labID: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

module.exports = mongoose.model('Seat', SeatSchema);
