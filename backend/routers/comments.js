const events_controller = require("../controllers/EventsController");
const Router = require('express')
const router = new Router;

router.patch('/:comment_id/edit', events_controller.editComment);
router.delete('/:comment_id/delete', events_controller.deleteComment);

module.exports = router;