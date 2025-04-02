import jwt from 'jsonwebtoken';

const setAuthLocals = (req, res, next) => {
    const token = req.cookies.accessToken;

    res.locals.isLoggedInAsStudent = false;
    res.locals.isLoggedInAsAdmin = false;
    res.locals.user = null;

    if (!token) {
        console.warn("No access token found in cookies.");
        return next(); 
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return next(); 
        }

        console.log("Decoded User from Token:", user); 

        req.user = user;
        res.locals.isLoggedInAsStudent = user.role === "student";
        res.locals.isLoggedInAsAdmin = user.role === "admin";
        res.locals.user = user;

        next();
    });
};


export {
    setAuthLocals
};
