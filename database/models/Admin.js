import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    profilePicture: { type: String, default: '../../public/img/default-profile.png' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLoginAt: { type: Date },
    rememberToken: { type: String },
    rememberTokenExpiresAt: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFACode: { type: String },
    twoFACodeExpiresAt: { type: Date },
}, { timestamps: true });

const adminModel = model('Admin', AdminSchema);

/* =============================== */
/* READ */
/* =============================== */
const getAdmins = async () => {
    try {
        return await adminModel.find()
            .sort({ lastName: 1, firstName: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Admin documents:", error);
        throw error;
    }
};

const getAdminById = async (id) => {
    try {
        return await adminModel.findById(id).lean();
    } catch (error) {
        console.error("Error fetching Admin document by id:", error);
        throw error;
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createAdmin = async (adminData) => {
    try {
        const newAdmin = new adminModel(adminData);
        await newAdmin.save();
        return newAdmin.toObject();
    } catch (error) {
        console.error("Error creating Admin document:", error);
        throw error;
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateAdmin = async (id, adminData) => {
    try {
        const admin = await adminModel.findByIdAndUpdate(id, adminData, { new: true });
        return admin ? admin.toObject() : null;
    } catch (error) {
        console.error("Error updating Admin document by id:", error);
        throw error;
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteAdmin = async (id) => {
    try {
        const admin = await adminModel.findByIdAndDelete(id);
        return admin ? admin.toObject() : null;
    } catch (error) {
        console.error("Error deleting Admin document by id:", error);
        throw error;
    }
};

export default {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
