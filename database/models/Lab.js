const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabSchema = new Schema({
    building: { type: String, required: true },
    room: { type: String, required: true },
    seatIds: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
    daysOpen: [{ type: String, required: true }],
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Under Maintenance'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Lab', LabSchema);
