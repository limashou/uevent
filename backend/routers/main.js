const Router = require('express');
const authentication = require('./authentication');
const companies = require('./companies')
const users = require('./user')
const router = new Router();

router.use('/api/auth', authentication);
router.use('/api/company', companies);
router.use('/api/users', users);
module.exports = router;