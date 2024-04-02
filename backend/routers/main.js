const Router = require('express');
const authentication = require('./authentication');
const companies = require('./companies')
const router = new Router();

router.use('/api/auth', authentication);
router.use('/api/company', companies);
module.exports = router;