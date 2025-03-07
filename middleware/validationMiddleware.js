import { validationResult } from 'express-validator';

// Check validation results
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Continue to the next middleware/controller
};

export default checkValidation;
