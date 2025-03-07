import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Assigned to CJ //

// Student Schema
const StudentSchema = new Schema({
    universityID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

const studentModel = model('Student', StudentSchema);

/* READ */
const getAll = async () => {
    try {
        return await studentModel.find()
            .sort({ lastName: 1, firstName: 1 })
            .lean();
    } catch (error) {
        console.error("Error fetching all Student documents:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        return await studentModel.findById(id)
            .lean();
    } catch (error) {
        console.error("Error fetching Student document by id:", error);
        throw error;
    }
};

/* CREATE */
const create = async (studentData) => {
    try {
        const newStudent = new studentModel(studentData);
        await newStudent.save();
        return newStudent.toObject();
    } catch (error) {
        console.error("Error creating Student document:", error);
        throw error;
    }
};

/* UPDATE */
const updateById = async (id, studentData) => {
    try {
        const student = await studentModel.findByIdAndUpdate(id, studentData, { new: true });
        return student ? student.toObject() : null;
    } catch (error) {
        console.error("Error updating Student document by id:", error);
        throw error;
    }
};

/* DELETE */
const deleteById = async (id) => {
    try {
        const student = await studentModel.findByIdAndDelete(id);
        return student ? student.toObject() : null;
    } catch (error) {
        console.error("Error deleting Student document by id:", error);
        throw error;
    }
};

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
};
