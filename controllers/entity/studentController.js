import { Student } from '../../database/models/models.js';
import { Reservation } from '../../database/models/models.js';
import bcrypt from 'bcryptjs';

/* =============================== */
/* READ */
/* =============================== */
const getStudents = async (req, res) => {
    try {
        const students = await Student.getStudents(req.query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching students', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createStudent = async (req, res) => {
    try {
        const newStudent = await Student.createStudent(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating student', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
export const updateStudent = async (req, res) => {
    try {
        const { first_name, last_name, bio } = req.body;
        const userId = req.user.id;

        let updateData = {
            firstName: first_name,
            lastName: last_name,  
            bio: bio
        };        

        // If profile picture is uploaded, update it
        if (req.file) {
            updateData.profilePicture = `/public/uploads/profile_pics/${req.file.filename}`;
        }

        console.log("DEBUG - Uploaded File:", req.file);

        const updatedStudent = await Student.model.findByIdAndUpdate(userId, updateData, { new: true });
        console.log("DEBUG - Update Data:", updateData);

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        console.log("DEBUG - Updated Student:", updatedStudent);

        req.user = updatedStudent.toObject();  // Update the session's user object
        res.locals.user = req.user;            // Update the `res.locals.user` for current request

        // Update res.locals.user with the new data
        res.locals.user = updatedStudent;

        // Optionally, you could also send a response with the updated user object
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedStudent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user profile' });
    }
};

export const updateStudentPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Ensure both passwords are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required.' });
        }

        // Fetch the student user from the database, including the password field
        const student = await Student.model.findById(userId).select('+password');
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Compare the current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, student.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // Check if the new password is different from the current password
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
        }

        // Update the password only if it's not already hashed
        student.password = newPassword;  // Password is already hashed
        
        // Save the updated student record
        await student.save();

        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating password' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteStudent = async (req, res) => {
    const userId = req.user.id;  // Get the current logged-in user's ID
    const { password } = req.body;  // Get password from the request body

    try {
        console.log("Attempting to delete student with ID:", userId);  // Debug statement

        // Fetch the student data to validate the password
        const student = await Student.model.findById(userId).select('password');
        if (!student) {
            console.log("Student not found");  // Debug statement
            return res.status(404).json({ error: 'Student not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            console.log("Password mismatch");  // Debug statement
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Find and delete any reservations that have this student in creditedStudentIDs
        const deletedReservations = await Reservation.model.deleteMany({
            creditedStudentIDs: userId,
        });

        console.log(`Deleted ${deletedReservations.deletedCount} reservations for student ${userId}`);


        // Proceed to delete the student account
        const deletedStudent = await Student.deleteStudent(userId);
        if (!deletedStudent) {
            console.log("Error deleting student");  // Debug statement
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log("Student deleted successfully");  // Debug statement
        res.status(200).json({
            message: 'Student deleted successfully. Existing group reservations will be deleted. Inform your co-labmates to reserve a slot for themselves again.'
        });
    } catch (error) {
        console.error("Error deleting student:", error);  // Log error details
        res.status(500).json({ error: 'Error deleting student', details: error.message });
    }
};


/* =============================== */
/* VALIDATE */
/* =============================== */
const validateUniversityIDs = async (req, res) => {
    try {
        const { universityIDs } = req.body;

        if (!Array.isArray(universityIDs) || universityIDs.length === 0) {
            return res.status(400).json({ error: "No university IDs provided." });
        }

        // Find students with the provided university IDs
        const foundStudents = await Student.model.find({ universityID: { $in: universityIDs } });

        // Extract found university IDs and their corresponding object IDs
        const foundStudentsData = foundStudents.map(student => ({
            universityID: student.universityID,
            objectID: student._id.toString()  // Convert ObjectId to string for easier handling in frontend
        }));

        // Extract found university IDs
        const foundIDs = foundStudents.map(student => student.universityID);

        // Identify missing university IDs
        const missingIDs = universityIDs.filter(id => !foundIDs.includes(id));

        if (missingIDs.length > 0) {
            return res.status(400).json({ 
                error: "Some university IDs are invalid.", 
                missingIDs,
                foundStudentsData  // Return found students' object IDs
            });
        }

        // If all IDs are valid, return found students' object IDs
        return res.json({ 
            message: "All university IDs are valid.", 
            foundStudentsData 
        });

    } catch (error) {
        console.error("Error validating university IDs:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export default {
    getStudents,
    createStudent,
    updateStudent,
    updateStudentPassword,
    deleteStudent,
    validateUniversityIDs,
};
