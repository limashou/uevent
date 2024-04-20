const Router = require('express')
const router = new Router;
const authentication_controller = require('../controllers/AuthenticationController');
const token_controller = require('../controllers/TokenController');
const {registrationValidationChain, loginValidationChain} = require("../validators/users");
const validateRequest = require("../middleware/validateRequest");
const loginLimiter = require("../middleware/loginLimiter");

router.post('/register', registrationValidationChain, validateRequest, authentication_controller.register);
router.post('/login', loginLimiter, loginValidationChain, validateRequest, authentication_controller.login);
router.post('/logout', token_controller.deactivateToken);
router.post('/password-reset', authentication_controller.password_reset);
router.post('/password-reset/:invitationCode', authentication_controller.password_reset_confirmation);

module.exports = router