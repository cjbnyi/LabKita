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

const signup = async (req, res) => {
    const { universityID, email, password, confirmPassword } = req.body;
    console.log("DEBUG aC.js - Received data 1:", req.body); // Log the incoming data
    console.log("DEBUG aC.js - Password:", password);
    console.log("DEBUG aC.js - Confirm Password:", confirmPassword);


    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({ error: 'Password and confirm password are required' });
        }

        // Check password length
        if (password.length < 8) {
            console.log("Password too short!");
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            console.log("Passwords do not match!");
            return res.status(400).json({ error: 'Passwords do not match' });
            
        }

        // Check if the user already exists
        const existingUser = await Student.model.findOne({ email });
        if (existingUser) {
            console.log("Email already in use");
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Check if universityID is already taken
        const existingID = await Student.model.findOne({ universityID });
        if (existingID) {
            console.log("Student ID already in use");
            return res.status(400).json({ error: 'Student ID already in use' });
        }

        // Hash password and create new student
        console.log("DEBUG aC.js - Sending raw password to DB:", password);

        const newStudent = await Student.createStudent({
            universityID,
            email,
            password: password,
            firstName: 'Green',
            lastName: 'Archer',
            college: 'DLSU',
            course: 'inter',
            bio: 'gesic'
        });

        // Generate tokens
        const accessToken = generateAccessToken(newStudent);
        const refreshToken = generateRefreshToken(newStudent);

        // Store tokens in cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000 // 60 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
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
        console.log("🔐 Received Login Request for:", email);
        console.log("🔑 Password Attempted:", password); // Logs the password (only for dev purposes, avoid in production)

        // Find user
        const user = await getUserByEmail(email);
        console.log("🔍 User lookup result:", user);

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        console.log("🔑 Validating password for user:", email);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid credentials for:", email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        console.log("✅ Password is correct, generating tokens for user:", email);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        console.log("🔑 Access token and refresh token generated successfully");

        // Store access token in an httpOnly cookie
        console.log("🍪 Storing access token in cookie");
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000 // 60 minutes
        });

        // Store refresh token in an httpOnly cookie
        console.log("🍪 Storing refresh token in cookie");
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 21 * 24 * 60 * 60 * 1000 // 21 days
        });

        console.log("✅ Login successful for:", email);
        return res.status(200).json({ userType: user.role, message: "Login successful!" });
    } catch (error) {
        console.error("🔥 Login Error for:", email, error);
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
                maxAge: 60 * 60 * 1000 // 60 minutes
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
