const Router = require('express');
const authentication = require('./authentication');
const companies = require('./companies')
const users = require('./user')
const token = require('../controllers/TokenController');
const router = new Router();

router.post('/generate-session',token.createSession);
router.use('/api/auth', authentication);
router.use('/api/companies', companies);
router.use('/api/users', users);
module.exports = router;