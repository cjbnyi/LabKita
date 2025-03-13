import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
    universityID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student'], default: 'student' },
    profilePicture: { type: String, default: '../../public/img/default-profile.png' },
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

export default class Student {
    static model = model('Student', StudentSchema);

    static async getStudents(filter = {}) {
        try {
            return await this.model.find(filter)
                .populate("reservationList")
                .sort({ lastName: 1, firstName: 1 })
                .lean();
        } catch (error) {
            console.error("Error fetching Student documents:", error);
            throw new Error('Error fetching students');
        }
    }

    static async createStudent(studentData) {
        try {
            const newStudent = new this.model(studentData);
            await newStudent.save();
            return newStudent.toObject();
        } catch (error) {
            console.error("Error creating Student document:", error);
            throw new Error('Error creating student');
        }
    }

    static async updateStudent(id, studentData) {
        try {
            const student = await this.model.findByIdAndUpdate(id, studentData, { new: true });
            if (!student) throw new Error('Student not found');
            return student.toObject();
        } catch (error) {
            console.error("Error updating Student document by id:", error);
            throw new Error('Error updating student');
        }
    }

    static async deleteStudent(id) {
        try {
            const student = await this.model.findByIdAndDelete(id);
            if (!student) throw new Error('Student not found');
            return student.toObject();
        } catch (error) {
            console.error("Error deleting Student document by id:", error);
            throw new Error('Error deleting student');
        }
    }
}
