const Router = require('express')
const router = new Router;
const events_controller = require('../controllers/EventsController');
const ticket = require("../controllers/TicketsController");

//event
router.patch('/:event_id/edit', events_controller.editEvent);
router.delete('/:event_id/delete', events_controller.deleteEvent);

router.get('/', events_controller.allEvents);
router.get('/:event_id', events_controller.eventByID);
//comment
router.post('/:event_id/comments/create', events_controller.createComment);
router.get('/:event_id/comments', events_controller.allComments);

//tickets
router.post('/:event_id/create',ticket.creteTickets);
router.get('/:event_id/tickets', ticket.getTicketsByEvent);

module.exports = router;