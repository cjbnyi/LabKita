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

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user;
        next();
    });
};

export {
    authorizeRole,
    authenticateToken
};
