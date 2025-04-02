import { body, param, validationResult } from 'express-validator';

// Check validation results
export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

// Validate Mongo Id
export const validateMongoId = (paramName) => [
    param(paramName).isMongoId().withMessage('Invalid Mongo ID'),
];

// Validate user information
export const validateUserFields = () => [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
