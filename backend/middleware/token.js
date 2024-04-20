const {verifyToken} = require("../controllers/TokenController");
const Response = require("../models/response");

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

module.exports = tokenMiddleware;