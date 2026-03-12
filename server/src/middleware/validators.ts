import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg
            }))
        });
    }
    next();
};

export const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('role')
        .isIn(['artist', 'vixen'])
        .withMessage('Role must be either artist or vixen'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    validate
];

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

export const bookingValidation = [
    body('vixenId')
        .isMongoId()
        .withMessage('Invalid vixen ID'),
    body('projectTitle')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Project title must be between 3 and 100 characters')
        .escape(),
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters')
        .escape(),
    body('date')
        .custom((value) => {
            if (!value) throw new Error('Date is required');
            const date = new Date(value);
            if (isNaN(date.getTime())) throw new Error('Please provide a valid date');
            return true;
        }),
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .escape(),
    body('rateOffered')
        .isNumeric()
        .withMessage('Rate must be a number')
        .isInt({ min: 0 })
        .withMessage('Rate must be a positive number'),
    validate
];

export const artistProfileValidation = [
    body('stageName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Stage name must be between 2 and 50 characters')
        .escape(),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters')
        .escape(),
    body('genre')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Genre must be between 2 and 50 characters')
        .escape(),
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .escape(),
    validate
];

export const vixenProfileValidation = [
    body('stageName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Stage name must be between 2 and 50 characters')
        .escape(),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters')
        .escape(),
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters')
        .escape(),
    body('rate')
        .optional()
        .isNumeric()
        .withMessage('Rate must be a number')
        .isInt({ min: 0 })
        .withMessage('Rate must be a positive number'),
    body('currency')
        .optional()
        .isIn(['NGN', 'GHS', 'USD'])
        .withMessage('Currency must be NGN, GHS, or USD'),
    validate
];

export const reviewValidation = [
    body('bookingId')
        .isMongoId()
        .withMessage('Invalid booking ID'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters')
        .escape(),
    validate
];

export const messageValidation = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters')
        .escape(),
    validate
];

export const mongoIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    validate
];

export const userIdValidation = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    validate
];

export const bookingIdValidation = [
    param('bookingId')
        .isMongoId()
        .withMessage('Invalid booking ID format'),
    validate
];
