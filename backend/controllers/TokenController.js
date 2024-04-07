const jwt = require('jsonwebtoken');
const Response = require('../models/response');
const {generateCode} = require("./Helpers");
const secretYaEby = 'secret key';
const blackStarBurger = new Set();

function generateToken(payload, expires = '24h') {
    const options = {
        expiresIn: expires,
    };
    return jwt.sign(payload, secretYaEby, options);
}

function deactivateToken(req, res) {
    let token;
    try {
        if (req.cookies.auth_token) {
            token = req.cookies.auth_token.replace('Bearer ', '');
        } else if (req.cookies.session_token) {
            token = req.cookies.session_token.replace('Bearer ', '');
        }
    } catch (e) {}

    if (!token) {
        return res.json(new Response(false, 'Отсутствует токен'));
    }
    if (blackStarBurger.has(token)){
        return res.json(new Response(false, 'Токен уже удален!'));
    }
    blackStarBurger.add(token);
    res.json(new Response(true, 'Токен успешно удален'));
}

function verifyToken(req, res, next) {
    let token;
    try {
        if (req.cookies.auth_token) {
            token = req.cookies.auth_token.replace('Bearer ', '');
        } else if (req.cookies.session_token) {
            token = req.cookies.session_token.replace('Bearer ', '');
        }
    } catch (e) {}

    if (!token) {
        return res.status(401).json(new Response(false, 'Отсутствует токен авторизации'));
    }
    if (blackStarBurger.has(token)){
        return res.status(401).json(new Response(false, 'Токен удален!'));
    }

    jwt.verify(token, secretYaEby, (err, decoded) => {
        if (err) {
            return res.status(401).json(new Response(false, 'Недействительный токен'));
        } else {
            req.senderData = decoded;
            next();
        }
    });
}

function verifyLogin(req, res, next) {
    const token = req.params.confirm_token;
    jwt.verify(token, secretYaEby, (err, decoded) => {
        if (err) {
            return res.json(new Response(false, 'Недействительный токен'));
        } else {
            req.senderData = decoded;
            next();
        }
    });
}

async function createSession(req, res) {
    const sessionData = {
        sessionId: generateCode()
    };
    const sessionToken = generateToken(sessionData);
    res.cookie('session_token', sessionToken, { httpOnly: true, maxAge: 3600000 });
    res.json(new Response(true, 'Сеанс создан'));
}

module.exports = {
    generateToken,
    verifyToken,
    deactivateToken,
    verifyLogin,
    createSession
}

