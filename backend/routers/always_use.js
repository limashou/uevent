// middleware.js
const { createSession, verifyToken } = require("../controllers/TokenController");

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
                res.status(error.status || 500).json({ success: false, message: error.message });
            });
    }
}

function tokenMiddleware(req, res, next) {
    console.log(req.cookies);
    if (req.cookies.auth_token || req.cookies.session_token) {
        if (req.cookies.auth_token) {
            verifyToken(req, res)
                .then(() => {
                    console.log("verify");
                    next();
                })
                .catch(error => {
                    console.error(error);
                    res.status(error.status || 500).json({ success: false, message: 'Отсутствует токен авторизации'});
                });
        } else if (req.cookies.session_token) {
            verifyToken(req, res)
                .then(() => {
                    console.log("verify");
                    next();
                })
                .catch(error => {
                    console.error(error);
                    res.status(error.status || 500).json({ success: false, message: 'Отсутствует токен сесии' });
                });
        }
    }
}

module.exports = {
    sessionMiddleware,
    tokenMiddleware
};
