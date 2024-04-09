const { createSession, verifyToken } = require("../controllers/TokenController");
const Response = require("../models/response");

function sessionMiddleware(req, res, next) {
    if (req.cookies.session_token) {
       next();
    } else {
        createSession(req, res)
            .then(() => {
                console.log("create");
                next();
            })
            .catch(error => {
                console.error(error);
                res.status(error.status || 500).json(new Response(false,"Something wrong"));
            });
    }
}

// function tokenMiddleware(req, res, next) {
//     console.log(req.cookies);
//     if (req.cookies.auth_token || req.cookies.session_token) {
//         if (req.cookies.auth_token) {
//             verifyToken(req, res)
//                 .then(() => {
//                     console.log("verify");
//                     next();
//                 })
//                 .catch(error => {
//                     console.error(error);
//                     res.status(error.status || 500).json({ success: false, message: 'Отсутствует токен авторизации'});
//                 });
//         }
//         else if (req.cookies.session_token) {
//             verifyToken(req, res)
//                 .then(() => {
//                     console.log("verify");
//                     next();
//                 })
//                 .catch(error => {
//                     console.error(error);
//                     res.status(error.status || 500).json({ success: false, message: 'Отсутствует токен сесии' });
//                 });
//         }
//     }
// }
function tokenMiddleware(req, res, next) {
    console.log(req.cookies);
    if (req.cookies.auth_token || req.cookies.session_token) {
        verifyToken(req, res)
            .then(() => {
                console.log("verify");
                next();
            })
            .catch(error => {
                console.error(error);
                res.status(error.status || 401).json(new Response(false, 'Ошибка аутентификации'));
            });
    } else {
        console.log("Отсутствует токен аутентификации или сессии");
        res.status(401).json(new Response(false, 'Отсутствует токен аутентификации или сессии'));
    }
}

module.exports = {
    sessionMiddleware,
    tokenMiddleware
};
