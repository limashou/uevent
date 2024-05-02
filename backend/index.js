const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const router = require('./routers/main');
const cors = require('cors');
const client = require("./db");
const sessionMiddleware = require("./middleware/session");
const tokenMiddleware = require("./middleware/token");
const sessionLimiter = require("./middleware/sessionLimiter");
const fs = require("fs");
const https = require("https");

const app = express();

const options = {
    key: fs.readFileSync('../localhost-key.pem'),
    cert: fs.readFileSync('../localhost.pem')
};

app.use(cors({
    origin: ['https://localhost:3000', 'https://192.168.1.2:3000', 'https://192.168.1.3:3000'],
    credentials: true,
}));

app.use(
    session({
        secret: 'session secret',
        resave: false,
        saveUninitialized: true
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(tokenMiddleware);
app.use(router);
app.use(sessionLimiter);
app.use(express.static('images'));

client.connect()
    .then(() => console.log('Успешное подключение к PostgreSQL'))
    .catch(err => console.error('Ошибка подключения:', err));

const PORT = process.env.PORT || 3001;

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server started on https://localhost:${PORT}`);
});