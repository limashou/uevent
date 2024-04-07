const Router = require('express')
const router = new Router;
const events_controller = require('../controllers/EventsController');
const token_controller = require('../controllers/TokenController');

router.post('/location',events_controller.Location);
//event
router.post('/:company_id/create', token_controller.verifyToken, events_controller.createEvent);
router.patch('/:company_id/edit', token_controller.verifyToken, events_controller.editEvent);
router.delete('/:company_id/delete/:id', token_controller.verifyToken, events_controller.deleteEvent);
router.get('/:company_id/all', token_controller.verifyToken, events_controller.allEvents);
router.get('/:company_id/byId/:id', token_controller.verifyToken, events_controller.eventByID);
//comment
router.post('/:event_id/comments/create', token_controller.verifyToken, events_controller.createComment);
router.patch('/:event_id/comments/edit', token_controller.verifyToken, events_controller.editComment);
router.delete('/:event_id/comments/delete/:id', token_controller.verifyToken, events_controller.deleteComment);
router.get('/:event_id/comments', token_controller.verifyToken, events_controller.allComments);


module.exports = router;