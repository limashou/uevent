const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const router = require('./routers/main');
const cors = require('cors');
const client = require("./db");

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.2:3000', 'http://192.168.1.3:3000'],
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
app.use(router);
app.use(express.static('images'));

client.connect()
    .then(() => console.log('Успешное подключение к PostgreSQL'))
    .catch(err => console.error('Ошибка подключения:', err));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Сервер запущен http://localhost:${PORT}`);
});