import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
    universityID: { type: String, required: true, unique: true, trim: true, index: true},
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true,
        immutable: true,
        index: true,
        match: [/^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/, 'Email must be a valid DLSU email (e.g., example@dlsu.edu.ph).']
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin', immutable: true },
    profilePicture: { type: String, default: '/img/default-profile.png' },
}, { timestamps: true });

// Ensure passwords are hashed before saving
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (!this.password.startsWith('$2a$')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default class Admin {
    static model = model('Admin', AdminSchema);

    static async getAdmins(filter = {}) {
        try {
            return await this.model.find(filter)
                .sort({ lastName: 1, firstName: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Admin documents:", error);
            throw new Error(`Error fetching admins: ${error.message}`);
        }
    }

    static async createAdmin(adminData) {
        try {
            // Ensure password hashing before saving (use bcrypt or similar library)
            const newAdmin = await this.model.create(adminData);
            return newAdmin.toObject();
        } catch (error) {
            console.error("Error creating Admin document:", error);
            throw new Error(`Error creating admin: ${error.message}`);
        }
    }

    static async updateAdmin(id, adminData) {
        try {
            if (adminData.role) delete adminData.role; // Prevent role modification
    
            // Hash new password if provided and not already hashed
            if (adminData.password && !adminData.password.startsWith('$2a$')) {
                adminData.password = await bcrypt.hash(adminData.password, 10);
            }
    
            const admin = await this.model.findByIdAndUpdate(id, adminData, { new: true, runValidators: true });
            if (!admin) throw new Error('Admin not found');
            return admin.toObject();
        } catch (error) {
            console.error("Error updating Admin document by id:", error);
            throw new Error(`Error updating admin: ${error.message}`);
        }
    }    

    static async deleteAdmin(id) {
        try {
            const admin = await this.model.findByIdAndDelete(id);
            if (!admin) throw new Error('Admin not found');
            return admin.toObject();
        } catch (error) {
            console.error("Error deleting Admin document by id:", error);
            throw new Error(`Error deleting admin: ${error.message}`);
        }
    }
}
