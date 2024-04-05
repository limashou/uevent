const Router = require('express')
const router = new Router;
const user = require('../controllers/UserController');
const upload = require('./multer');
const token_controller = require('../controllers/TokenController');

router.get('/all',token_controller.verifyToken,user.getAllUser);
router.get('/:id', token_controller.verifyToken, user.getById);
router.patch('/update', token_controller.verifyToken, user.updateUser);
router.patch('/avatar', token_controller.verifyToken, upload.single('photo'), user.avatarUpload);
router.get('/:user_id/avatar', token_controller.verifyToken, user.userAvatar);
router.post('/findBy', token_controller.verifyToken, user.findByFullName);
module.exports = router;