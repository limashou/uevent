const Router = require('express')
const router = new Router;
const user = require('../controllers/UserController');
const token_controller = require('../controllers/TokenController');
const {uploadUser} = require("./multer");

router.get('/all',user.getAllUser);
router.get('/:id', user.getById);
router.patch('/update', user.updateUser);
router.patch('/avatar', uploadUser.single('photo'), user.avatarUpload);
router.get('/:user_id/avatar', user.userAvatar);
router.post('/findBy', user.findByFullName);
module.exports = router;