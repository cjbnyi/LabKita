import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Assigned to CJ //

// Admin Schema
const AdminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLoginAt: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFACode: { type: String },
    twoFACodeExpiresAt: { type: Date },
}, { timestamps: true });

export default model('Admin', AdminSchema);

/* READ */


/* CREATE */


/* UPDATE */


/* DELETE */

