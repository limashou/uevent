const { body } = require('express-validator');

const companyNewsValidationChain = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 90 })
        .withMessage('Title must be between 1 and 90 characters long'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Content must not be empty'),
];

module.exports = {
    companyNewsValidationChain,
};
