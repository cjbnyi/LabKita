import { body, param } from 'express-validator';

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
