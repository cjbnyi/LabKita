import mongoose from 'mongoose';
import { Admin, Student } from '../database/models/models.js';

const userModels = [Admin, Student];

export const getUserByEmail = async (email) => {
    for (const Model of userModels) {
        const user = await Model.findOne({ email: email });
        if (user) return { user, Model };
    }
    return null; // No matching user found
};
