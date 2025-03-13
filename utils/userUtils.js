import mongoose from 'mongoose';
import { Admin, Student } from '../database/models/models.js';

console.log("✅ Admin Model:", Admin);
console.log("✅ Student Model:", Student);

const userModels = { admins: Admin, students: Student };


export const getUserByEmail = async (email) => {
    console.log("🔍 Looking up user with email:", email);

    for (const [collectionName, Model] of Object.entries(userModels)) {
        console.log(`🔎 Checking ${collectionName} model:`, Model);

        if (Model && typeof Model.findOne === "function") {
            const user = await Model.findOne({ email });
            if (user) return { user, collectionName };
        } else {
            console.error(`🚨 ERROR: ${collectionName} model is invalid or not defined!`);
        }
    }

    console.log("❌ No matching user found.");
    return null;
};