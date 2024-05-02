const company_controller = require("../controllers/CompaniesController");
const Router = require('express')
const router = new Router;

router.delete('/:subscribe_id/unsubscribe', company_controller.userUnsubscribe);
router.patch('/:subscribe_id/changeSubscribe', company_controller.userChangeSubscribe);
router.get('/:subscribe_id', company_controller.getSubscribeData);

module.exports = router;