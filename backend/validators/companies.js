const { body } = require('express-validator');
const Company = require('../models/companies');

const companyCreationValidationChain = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Company name must be between 1 and 30 characters long')
        .custom(async (value) => {
            const company = await new Company().find({ name: value });
            if (company.length !== 0) {
                throw new Error('Company name is already taken');
            }
        }),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom(async (value) => {
            const company = await new Company().find({ email: value });
            if (company.length !== 0) {
                throw new Error('Email is already registered for another company');
            }
        }),
    body('location')
        .trim()
        .isLength({ min: 1, max: 256 })
        .withMessage('Location must be between 1 and 256 characters long'),
    body('latitude')
        .isDecimal()
        .withMessage('Latitude must be a decimal number'),
    body('longitude')
        .isDecimal()
        .withMessage('Longitude must be a decimal number'),
    body('description')
        .optional()
        .trim(),
];

const companyEditValidationChain = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Company name must be between 1 and 30 characters long')
        .custom(async (value) => {
            const company = await new Company().find({name: value});
            if (company.length !== 0) {
                throw new Error('Company name is already taken');
            }
        }),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom(async (value) => {
            const company = await new Company().find({email: value});
            if (company.length !== 0) {
                throw new Error('Email is already registered for another company');
            }
        }),
    body('location')
        .optional()
        .trim()
        .isLength({ min: 1, max: 256 })
        .withMessage('Location must be between 1 and 256 characters long'),
    body('latitude')
        .optional()
        .isDecimal()
        .withMessage('Latitude must be a decimal number'),
    body('longitude')
        .optional()
        .isDecimal()
        .withMessage('Longitude must be a decimal number'),
    body('description')
        .optional()
        .trim(),
];

module.exports = {
    companyCreationValidationChain,
    companyEditValidationChain
};
