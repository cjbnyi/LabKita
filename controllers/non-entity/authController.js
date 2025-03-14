import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../../utils/userUtils.js';
import Student from '../../database/models/Student.js'

/* =============================== */
/* SIGN-UP */
/* =============================== */
const signup = async (req, res) => {
    const {universityID, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await Student.model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Check if universityID is already taken
        const existingID = await Student.model.findOne({ universityID });
        if (existingID) {
            return res.status(400).json({ error: 'Student ID already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use createStudent function to insert the student
        const newStudent = await Student.createStudent({
            universityID,
            email,
            password: hashedPassword,
            firstName: 'Green',
            lastName: 'Archer',
            college: 'DLSU',
            course: 'inter',
            bio: 'gesic'
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};

/* =============================== */
/* LOGIN */
/* =============================== */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔍 Received Login Request:", email);

        // Find user
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Return success response
        return res.status(200).json({ message: "Login successful!", userType: user.role });
    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/* =============================== */
/* LOGOUT */
/* =============================== */
const logout = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if the user exists
        const { user } = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Clear the remember token
        if (user.rememberToken) {
            user.rememberToken = null;
            user.rememberTokenExpiresAt = null;
            await user.save();
        }
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging out' });
    }
};

export default {
    signup,
    login,
    logout
};
