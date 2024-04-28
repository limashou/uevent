const Router = require('express')
const router = new Router;
const user = require('../controllers/UserController');
const {uploadUser} = require("./multer");
const validateRequest = require("../middleware/validateRequest");
const {editProfileValidationChain} = require("../validators/users");

router.get('/',user.getAllUser);
router.get('/me/tickets', user.getTickets);
router.get('/:user_id', user.getById);
router.patch('/update', editProfileValidationChain, validateRequest, user.updateUser);
router.patch('/avatar', uploadUser.single('photo'), user.avatarUpload);
router.get('/:user_id/avatar', user.userAvatar);
router.post('/findBy', user.findByFullName);
router.get('/notification',user.getNotification);
module.exports = router;