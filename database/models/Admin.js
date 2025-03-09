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

export default class Admin {
    static model = model('Admin', AdminSchema);

    static async getAdmins(filter = {}) {
        try {
            return await this.model.find(filter)
                .sort({ lastName: 1, firstName: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Admin documents:", error);
            throw new Error('Error fetching admins');
        }
    }

    static async createAdmin(adminData) {
        try {
            const newAdmin = new this.model(adminData);
            await newAdmin.save();
            return newAdmin.toObject();
        } catch (error) {
            console.error("Error creating Admin document:", error);
            throw new Error('Error creating admin');
        }
    }

    static async updateAdmin(id, adminData) {
        try {
            const admin = await this.model.findByIdAndUpdate(id, adminData, { new: true });
            if (!admin) throw new Error('Admin not found');
            return admin.toObject();
        } catch (error) {
            console.error("Error updating Admin document by id:", error);
            throw new Error('Error updating admin');
        }
    }

    static async deleteAdmin(id) {
        try {
            const admin = await this.model.findByIdAndDelete(id);
            if (!admin) throw new Error('Admin not found');
            return admin.toObject();
        } catch (error) {
            console.error("Error deleting Admin document by id:", error);
            throw new Error('Error deleting admin');
        }
    }
}
