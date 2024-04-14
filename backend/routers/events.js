const Router = require('express')
const router = new Router;
const events_controller = require('../controllers/EventsController');
const ticket = require("../controllers/TicketsController");

router.post('/location',events_controller.Location);
//event
router.patch('/:event_id/edit', events_controller.editEvent);
router.delete('/:event_id/delete', events_controller.deleteEvent);

router.get('/all', events_controller.allEvents);
router.get('/:event_id', events_controller.eventByID);
//comment
router.post('/:event_id/comments/create', events_controller.createComment);
router.patch('/:event_id/comments/edit', events_controller.editComment);
router.delete('/:event_id/comments/delete/:id', events_controller.deleteComment);
router.get('/:event_id/comments', events_controller.allComments);

//tickets
router.post('/:event_id/create',ticket.creteTickets);
router.get('/:event_id/all', ticket.getTicketsByEvent);

module.exports = router;