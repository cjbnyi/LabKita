import mongoose from 'mongoose';
import AdminModel from '../models/Admin.js';
import StudentModel from '../models/Student.js';

const userModels = [AdminModel, StudentModel];

export const getUserByEmail = async (email) => {
    for (const Model of userModels) {
        const user = await Model.findOne({ email: email });
        if (user) return { user, Model };
    }
    return null; // No matching user found
};
