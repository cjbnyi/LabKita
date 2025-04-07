import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserById } from "../utils/userUtils.js"; // ← make sure this is imported
import { getStudentByID } from "../utils/userUtils.js"; // Function to fetch user from DB

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const setAuthLocals = async (req, res, next) => {
    const token = req.cookies.accessToken;

    res.locals.isLoggedInAsStudent = false;
    res.locals.isLoggedInAsAdmin = false;
    res.locals.user = null;

    if (!token) {
        console.warn("No access token found in cookies.");
        return next(); 
    }

    try {
        const decoded = await verifyToken(token); // Now this works with await!

        // Fetch updated user data from DB
        const freshUser = await getUserByEmail(decoded.email);
        if (!freshUser) {
            return next();
        }

        req.user = freshUser;
        res.locals.isLoggedInAsStudent = freshUser.role === "student";
        res.locals.isLoggedInAsAdmin = freshUser.role === "admin";
        res.locals.user = freshUser;

        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return next();
    }
};

export { setAuthLocals };
