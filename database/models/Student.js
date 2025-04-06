import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
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
    role: { type: String, enum: ['student'], default: 'student' },
    profilePicture: { type: String, default: '../../public/img/default-profile.png' },
    college: { type: String },
    course: { type: String },
    bio: { type: String },
}, { timestamps: true });

// Ensure passwords are hashed before saving
StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    console.log("DEBUG student.js - Password before hashing:", this.password);
    if (!this.password.startsWith('$2a$')) { // Prevent double hashing
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default class Student {
    static model = model('Student', StudentSchema);

    static async getStudents(filter = {}) {
        try {
            return await this.model.find(filter)
                .sort({ lastName: 1, firstName: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Student documents:", error);
            throw new Error(`Error fetching students: ${error.message}`);
        }
    }

    static async createStudent(studentData) {
        try {
            const newStudent = await this.model.create(studentData);
            console.log("DEBUG student.js - Stored Password in DB:", newStudent.password);
            return newStudent.toObject();
        } catch (error) {
            console.error("Error creating Student document:", error);
            throw new Error(`Error creating student: ${error.message}`);
        }
    }

    static async updateStudent(id, studentData) {
        try {
            if (studentData.password && !studentData.password.startsWith('$2a$')) {
                studentData.password = await bcrypt.hash(studentData.password, 10);
            } else {
                delete studentData.password; // Prevent overwriting with undefined
            }
            const student = await this.model.findByIdAndUpdate(id, studentData, { new: true, runValidators: true });
            if (!student) throw new Error('Student not found');
            return student.toObject();
        } catch (error) {
            console.error("Error updating Student document by id:", error);
            throw new Error(`Error updating student: ${error.message}`);
        }
    }    

    static async deleteStudent(id) {
        try {
            const student = await this.model.findByIdAndDelete(id);
            if (!student) throw new Error('Student not found');
            return student.toObject();
        } catch (error) {
            console.error("Error deleting Student document by id:", error);
            throw new Error(`Error deleting student: ${error.message}`);
        }
    }
}
