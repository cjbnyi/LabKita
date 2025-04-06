import { Student } from '../../database/models/models.js';

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
            updateData.profilePicutre = `/public/uploads/profile_pics/${req.file.filename}`;
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

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new password are required.' });
        }

        const studentId = req.user._id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        await student.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error. Could not update password.' });
    }

}

/* =============================== */
/* DELETE */
/* =============================== */
const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const deletedStudent = await Student.deleteStudent(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting student', details: error.message });
    }
};

/* =============================== */
/* VALIDATE */
/* =============================== */
const validateStudents = async (req, res) => {
    try {
        const { studentNames } = req.body;
        console.log("Received student names for validation:", studentNames);

        if (!Array.isArray(studentNames) || studentNames.length === 0) {
            console.log("Invalid input: studentNames is not an array or is empty.");
            return res.status(400).json({ message: "Invalid input. Provide an array of student names." });
        }

        // Convert names into query format
        const queryConditions = studentNames.map(name => {
            const nameParts = name.trim().split(" ");
            const firstName = nameParts.slice(0, nameParts.length - 1).join(" "); // Everything except the last part is the first name
            const lastName = nameParts[nameParts.length - 1]; // The last part is the last name
            return { firstName, lastName };
        });

        console.log("Query conditions for MongoDB:", JSON.stringify(queryConditions, null, 2));

        // Fetch students matching the provided names
        const students = await Student.model.find({
            $or: queryConditions
        });

        console.log("Students found in database:", students);

        // Extract valid names
        const validStudents = students.map(student => `${student.firstName} ${student.lastName}`);
        console.log("Validated student names:", validStudents);

        // Find any invalid students
        const invalidStudents = studentNames.filter(name => !validStudents.includes(name));
        console.log("Invalid student names:", invalidStudents);

        res.json({ validStudents, invalidStudents });

    } catch (error) {
        console.error("Error validating students:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export default {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    validateStudents
};
