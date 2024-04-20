const Router = require('express');
const authentication = require('./authentication');
const companies = require('./companies')
const users = require('./user')
const events = require('./events');
const tickets = require('./tickets');
const comments = require('./comments');
const news = require('./news');
const router = new Router();

router.use('/api/auth', authentication);
router.use('/api/companies', companies);
router.use('/api/users', users);
router.use('/api/events', events);
router.use('/api/tickets', tickets);
router.use('/api/comments', comments)
router.use('/api/news',news);
module.exports = router;