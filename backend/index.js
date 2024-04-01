const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const router = require('./routers/main');
const cors = require('cors');
const client = require("./db");

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(
    session({
        secret: 'session secret',
        resave: false,
        saveUninitialized: true
    })
);
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