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

export {
    generateAccessToken,
    generateRefreshToken,
};
