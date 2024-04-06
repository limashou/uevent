const Router = require('express')
const router = new Router;
const user = require('../controllers/UserController');
const token_controller = require('../controllers/TokenController');
const {uploadUser} = require("./multer");

router.get('/all',token_controller.verifyToken,user.getAllUser);
router.get('/:id', token_controller.verifyToken, user.getById);
router.patch('/update', token_controller.verifyToken, user.updateUser);
router.patch('/avatar', token_controller.verifyToken, uploadUser.single('photo'), user.avatarUpload);
router.get('/:user_id/avatar', token_controller.verifyToken, user.userAvatar);
router.post('/findBy', token_controller.verifyToken, user.findByFullName);
module.exports = router;