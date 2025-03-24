import jwt from 'jsonwebtoken';

// Authorize a specific user role
const authorizeRole = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user data found' });
    }
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Authenticate user via access token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user; // Attach user info to request
        next();
    });
};

export {
    authorizeRole,
    authenticateToken
};
