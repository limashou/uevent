const Router = require('express');
const authentication = require('./authentication');

const router = new Router();

router.use('/api/auth', authentication);

module.exports = router;