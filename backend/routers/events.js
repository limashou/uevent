const Router = require('express')
const router = new Router;
const events_controller = require('../controllers/EventsController');

router.post('/location',events_controller.Location);
//event
router.post('/:company_id/create', events_controller.createEvent);
router.patch('/:company_id/edit/:id', events_controller.editEvent);
router.delete('/:company_id/delete/:id', events_controller.deleteEvent);
router.get('/:company_id/all', events_controller.allEventsByCompany);
router.get('/all', events_controller.allEvents);
router.get('/:company_id/byId/:id', events_controller.eventByID);
//comment
router.post('/:event_id/comments/create', events_controller.createComment);
router.patch('/:event_id/comments/edit', events_controller.editComment);
router.delete('/:event_id/comments/delete/:id', events_controller.deleteComment);
router.get('/:event_id/comments', events_controller.allComments);


module.exports = router;