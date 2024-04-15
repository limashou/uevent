const Router = require('express')
const router = new Router;
const user = require('../controllers/UserController');
const {uploadUser} = require("./multer");

router.get('/',user.getAllUser);
router.get('/:user_id', user.getById);
router.patch('/update', user.updateUser);
router.patch('/avatar', uploadUser.single('photo'), user.avatarUpload);
router.get('/:user_id/avatar', user.userAvatar);
router.post('/findBy', user.findByFullName);
module.exports = router;