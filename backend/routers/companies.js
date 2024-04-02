const Router = require('express')
const router = new Router;
const company_controller = require('../controllers/CompaniesController');
const token_controller = require('../controllers/TokenController');

router.post('/create', token_controller.verifyToken, company_controller.createCompanies);

module.exports = router;