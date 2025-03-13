import mongoose from 'mongoose';
import { Admin, Student } from '../database/models/models.js';

const userModels = { admins: Admin, students: Student };

export const getUserByEmail = async (email) => {
    for (const [collectionName, Model] of Object.entries(userModels)) {
        if (Model && Model.findOne) {  // Ensure Model is valid
            const user = await Model.findOne({ email: email });
            if (user) return { user, collectionName };
        }
    }
    return null; // No matching user found
};