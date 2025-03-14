import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../../utils/userUtils.js';

/* =============================== */
/* SIGN-UP */
/* =============================== */
const signup = async (req, res) => {
    const { email, password, ...rest } = req.body;

    try {
        // Check if the user already exists
        const { user, Model } = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const newUser = new Model({ email, password: hashedPassword, ...rest });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: 'Error registering user' });
    }
};

/* =============================== */
/* LOGIN */
/* =============================== */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔍 Email received:", email);

        // Find user
        const user = await getUserByEmail(email);
        if (!user) {
            console.error("❌ No user found with this email:", email);
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure password exists
        if (!user.password) {
            console.error("🚨 User exists but password field is missing:", user);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Incorrect password for:", email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Remove password before sending response
        delete user.password;

        // Determine user type
        const userType = user.role === 'student' ? 'student' : 'admin';

        console.log("✅ Login successful for:", email);
        res.status(200).redirect('/');
    } catch (error) {
        console.error("🔥 Error logging in:", error);
        res.status(500).json({ error: 'Error logging in' });
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
