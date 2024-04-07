const { Client } = require('pg');

const client = new Client({
    user: 'mpoljatsky',
    host: 'localhost',
    database: 'uevent_lubiviy_poliatskiy',
    password: 'securepass',
    port: 5433,
});

module.exports = client;