const rateLimit = require("express-rate-limit");
const Response = require("../models/response");

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,

    keyGenerator: function (req /*, res*/) {
        return req.cookies.session_token;
    },
    handler: function (req, res, next) {
        res.status(429).json(new Response(false, "Too many login attempts. Please wait."));
    },

    standardHeaders: true,
    legacyHeaders: false
});

module.exports = loginLimiter;