import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/tokenUtils.js';
import { getUserById } from '../utils/userUtils.js';

// Authorize specific user roles
const authorizeRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user data found' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Authenticate user via access token
const authenticateToken = (req, res, next) => {
    let token = req.cookies.accessToken;

    if (!token) {
        console.warn("No access token found, checking refresh token...");
        return attemptRefreshToken(req, res, next);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.warn("Access token expired or invalid, checking refresh token...");
            return attemptRefreshToken(req, res, next);
        }

        console.log("Access token verified successfully.");
        req.user = user;
        res.locals.isLoggedInAsStudent = user.role === "student";
        res.locals.isLoggedInAsAdmin = user.role === "admin";
        next();
    });
};

// Helper function
const attemptRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        console.warn("No refresh token available.");
        return res.status(401).json({ message: "Access denied. No refresh token." });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.error("Refresh token invalid.");
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        // Fetch full user details from DB
        const user = await getUserById(decoded.id);
        if (!user) {
            console.error("User not found.");
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(403).json({ message: "User not found." });
        }

        console.log("Refresh token verified. Issuing new access token...");
        const newAccessToken = generateAccessToken(user);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        req.user = user;
        res.locals.isLoggedInAsStudent = user.role === "student";
        res.locals.isLoggedInAsAdmin = user.role === "admin";
        next();
    });
};

const tokenRefreshMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        console.log("No refresh token found. Skipping token refresh.");
        return next();  // No refresh token, just proceed
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.error("Invalid refresh token.");
            return next();  // If refresh token is invalid, just proceed to the next middleware
        }

        try {
            // Fetch the user from the database
            const user = await getUserById(decoded.id);
            if (!user) {
                console.error("User not found for refresh token.");
                return next();
            }

            // Generate a new access token
            const newAccessToken = generateAccessToken(user);

            // Set the new access token in the cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 15 * 60 * 1000  // 15 minutes
            });

            console.log("Access token refreshed successfully.");
        } catch (error) {
            console.error("Error fetching user for token refresh:", error);
        }

        next();
    });
};

export {
    authorizeRole,
    authenticateToken,
    tokenRefreshMiddleware
};
