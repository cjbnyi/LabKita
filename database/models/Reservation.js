const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = mongoose.model('Reservation', ReservationSchema);
