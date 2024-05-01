const { body } = require('express-validator');
const Model = require("../models/model");

const eventValidationChain = [
    body('name')
        .trim()
        .isString()
        .isLength({min: 3, max: 70})
        .withMessage('Name must be between 3 and 70 characters long'),
    body('notification')
        .optional()
        .isBoolean()
        .withMessage('Notification must be a boolean value'),
    body('description')
        .optional()
        .isString()
        .isLength({min: 1, max: 10000})
        .withMessage('Description must be between 1 and 70 characters long')
        .trim(),
    body('location')
        .optional()
        .trim()
        .isLength({max: 256})
        .withMessage('Location must be at most 256 characters long'),
    body('latitude')
        .optional()
        .isNumeric()
        .withMessage('Latitude must be a numeric value'),
    body('longitude')
        .optional()
        .isNumeric()
        .withMessage('Longitude must be a numeric value'),
    body('date')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 format'),
    body('format')
        .custom(async (value) => {
            const availableFormats = await new Model().loadEnumValues('formats');
            if (!availableFormats.includes(value)) {
                throw new Error('Invalid format');
            }
        }),
    body('theme')
        .custom(async (value) => {
            const availableThemes = await new Model().loadEnumValues('themes');
            if (!availableThemes.includes(value)) {
                throw new Error('Invalid theme');
            }
        })
];

const eventEditValidationChain = [
    body('name')
        .optional()
        .trim()
        .isString()
        .isLength({min: 3, max: 70})
        .withMessage('Name must be between 3 and 70 characters long'),
    body('notification')
        .optional()
        .isBoolean()
        .withMessage('Notification must be a boolean value'),
    body('description')
        .optional()
        .isString()
        .isLength({min: 1, max: 10000})
        .withMessage('Description must be between 1 and 70 characters long')
        .trim(),
    body('location')
        .optional()
        .trim()
        .isLength({max: 256})
        .withMessage('Location must be at most 256 characters long'),
    body('latitude')
        .optional()
        .isNumeric()
        .withMessage('Latitude must be a numeric value'),
    body('longitude')
        .optional()
        .isNumeric()
        .withMessage('Longitude must be a numeric value'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 format'),
    body('format')
        .optional()
        .custom(async (value) => {
            const availableFormats = await new Model().loadEnumValues('formats');
            if (!availableFormats.includes(value)) {
                throw new Error('Invalid format');
            }
        }),
    body('theme')
        .optional()
        .custom(async (value) => {
            const availableThemes = await new Model().loadEnumValues('themes');
            if (!availableThemes.includes(value)) {
                throw new Error('Invalid theme');
            }
        })
];


module.exports = {
    eventValidationChain,
    eventEditValidationChain
};