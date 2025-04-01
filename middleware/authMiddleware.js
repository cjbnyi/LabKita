import jwt from 'jsonwebtoken';

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
    const token = req.cookies.accessToken;

    console.log("Received authentication request.");
    console.log("Access Token from cookies:", token);

    if (!token) {
        console.warn("No access token found.");
        res.locals.isLoggedInAsStudent = false;
        res.locals.isLoggedInAsAdmin = false;
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err);
            res.locals.isLoggedInAsStudent = false;
            res.locals.isLoggedInAsAdmin = false;
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log("Token verified successfully. User data:", user);
        req.user = user;
        res.locals.isLoggedInAsStudent = user.role === "student";
        res.locals.isLoggedInAsAdmin = user.role === "admin";

        next();
    });
};

export {
    authorizeRole,
    authenticateToken
};
