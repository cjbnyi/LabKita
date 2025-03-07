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
    next(); // Continue to the next middleware/controller
};

// Validate Mongo Id
export const validateMongoId = [
    param('id').isMongoId().withMessage('Invalid mongo ID')
];

// Validate user information
export const validateUserFields = () => [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
