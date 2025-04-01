import jwt from 'jsonwebtoken';

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            universityID: user.universityID,
            profilePicture: user.profilePicture,
            role: user.role,
            bio : user.bio
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRATION }
    );
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRATION }
    );
};

// Verify and refresh access token
const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: 'Unauthorized' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Forbidden' });

            const accessToken = generateAccessToken({ id: user.id, role: user.role });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error refreshing token' });
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    refreshAccessToken
};
