const { createSession, verifyToken } = require("../controllers/TokenController");
const Response = require("../models/response");

function sessionMiddleware(req, res, next) {
    if (req.cookies.session_token) {
       next();
    } else {
        createSession(req, res)
            .then(() => {
                console.log("Session created successfully");
                next()
            })
            .catch(error => {
                console.error(error);
                res.status(error.status || 500).json(new Response(false,"Something wrong"));
            });
    }
}

function tokenMiddleware(req, res, next) {
    console.log(req.cookies);
    verifyToken(req, res)
        .then(() => {
            console.log("verify");
            next();
        })
        .catch(error => {
            console.error(error);
            res.status(error.status || 401).json(new Response(false, 'Ошибка аутентификации'));
        });
}

module.exports = {
    sessionMiddleware,
    tokenMiddleware
};
