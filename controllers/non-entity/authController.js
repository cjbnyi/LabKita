import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../../utils/userUtils.js';
import Student from '../../database/models/Student.js'

import {
    generateAccessToken,
    generateRefreshToken
} from '../../utils/tokenUtils.js';

const renderSignup = (req, res) => {
    res.status(200).render('register', { 
        title: "Signup to LabKita!",
        pageCSS: "/public/css/register.css"
    })
}

// TODO: Finalize this
const signup = async (req, res) => {
    const { universityID, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Check if universityID is already taken
        const existingID = await Student.findOne({ universityID });
        if (existingID) {
            return res.status(400).json({ error: 'Student ID already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // TODO: Finalize this.
        // Create new student
        const newStudent = await Student.create({
            universityID,
            email,
            password: hashedPassword,
            firstName: 'Green',
            lastName: 'Archer',
            college: 'DLSU',
            course: 'inter',
            bio: 'gesic'
        });

        // Generate tokens
        const accessToken = generateAccessToken(newStudent);
        const refreshToken = generateRefreshToken(newStudent);

        // Store access token in an httpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 * 1000 // TODO: Revert later to actual value
        });

        // Store refresh token in an httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 21 * 24 * 60 * 60 * 1000 // 21 days
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};

const renderLogin = (req, res) => {
    res.status(200).render('login', { 
        title: "Login to LabKita!",
        pageCSS: "/public/css/login.css"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Received Login Request:", email);

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

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store access token in an httpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Store refresh token in an httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 21 * 24 * 60 * 60 * 1000 // 21 days
        });

        return res.status(200).json({ userType: user.role, message: "Login successful!" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ error: 'No refresh token found' });
        }

        console.log("Logout request received"); // DEBUGGING

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ error: 'Error logging out' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Generate a new access token
            const newAccessToken = generateAccessToken(user);

            // Set new access token in cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            return res.status(200).json({ message: "Access token refreshed" });
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({ error: 'Error refreshing token' });
    }
};

export default {
    renderSignup,
    signup,
    renderLogin,
    login,
    logout,
    refreshAccessToken
};
