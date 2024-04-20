const { body } = require('express-validator');
const Model = require("../models/model");

const ticketValidationChain = [
    body('ticket_type')
        .custom(async (value) => {
            const availableTicketType = await new Model().loadEnumValues('ticket_types');
            if (!availableTicketType.includes(value)) {
                throw new Error('Invalid ticket_type');
            }
        }),
    body('price')
        .isNumeric()
        .withMessage('Price must be a number'),
    body('available_tickets')
        .isInt({ min: 1 })
        .withMessage('Available tickets must be a non-negative integer'),
];

module.exports = {
    ticketValidationChain,
};