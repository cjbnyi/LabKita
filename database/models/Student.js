const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    universityID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    course: { type: String },
    bio: { type: String },
    reservationList: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLoginAt: { type: Date },
    rememberToken: { type: String },
    rememberTokenExpiresAt: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFACode: { type: String },
    twoFACodeExpiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
