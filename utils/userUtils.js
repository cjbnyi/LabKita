import { Admin, Student } from '../database/models/models.js';

export async function getUserById(userId) {
    try {
        let user = await Admin.model.findById(userId).lean();
        if (user) return user;

        user = await Student.model.findById(userId).lean();
        if (user) return user;

        return null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Error fetching user");
    }
}

export async function getUserByEmail(email) {
    try {
        console.log("Searching for user with email:", email);

        let user = await Admin.model.findOne({ email }).lean().select("+password");
        if (user) {
            console.log("Admin found:", user);
            return user; 
        }

        user = await Student.model.findOne({ email }).lean().select("+password");
        if (user) {
            console.log("Student found:", user);
            return user;  
        }

        console.log("No user found with this email:", email);
        return null;
    } catch (error) {
        console.error("Error in getUserByEmail:", error);
        return null;
    }
}

export async function getStudentByID(studentID) {
    try {
        return await Student.model.findOne({ universityID: studentID }).lean();
    } catch (error) {
        console.error("Error fetching Student document:", error);
        throw new Error('Error fetching student');
    }
}
