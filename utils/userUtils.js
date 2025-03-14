import mongoose from 'mongoose';
import { Admin, Student } from '../database/models/models.js';

export async function getUserByEmail(email) {
    try {
        console.log("🔍 Searching for user with email:", email);

        let user = await Admin.model.findOne({ email }).lean();
        if (user) {
            console.log("✅ Admin found:", user);
            return user;  // ✅ Return immediately if an admin is found
        }

        user = await Student.model.findOne({ email }).lean();
        if (user) {
            console.log("✅ Student found:", user);
            return user;  // ✅ Return student if found
        }

        console.log("❌ No user found with this email:", email);
        return null;
    } catch (error) {
        console.error("🔥 Error in getUserByEmail:", error);
        return null;
    }
}