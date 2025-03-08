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

export const Admin = model('Admin', AdminSchema);

/* =============================== */
/* CRUD OPERATIONS */
/* =============================== */
export const getAdmins = async (filter = {}) => {
    try {
        return await Admin.find(filter)
            .sort({ lastName: 1, firstName: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching Admin documents:", error);
        throw new Error('Error fetching admins');
    }
};

export const createAdmin = async (adminData) => {
    try {
        const newAdmin = new Admin(adminData);
        await newAdmin.save();
        return newAdmin.toObject();
    } catch (error) {
        console.error("Error creating Admin document:", error);
        throw new Error('Error creating admin');
    }
};

export const updateAdmin = async (id, adminData) => {
    try {
        const admin = await Admin.findByIdAndUpdate(id, adminData, { new: true });
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin.toObject();
    } catch (error) {
        console.error("Error updating Admin document by id:", error);
        throw new Error('Error updating admin');
    }
};

export const deleteAdmin = async (id) => {
    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin.toObject();
    } catch (error) {
        console.error("Error deleting Admin document by id:", error);
        throw new Error('Error deleting admin');
    }
};
