const Router = require('express')
const router = new Router;
const events_controller = require('../controllers/EventsController');
const ticket = require("../controllers/TicketsController");
const {uploadEvent} = require("./multer");
const {uploadNews} = require("./multer");
const validateRequest = require("../middleware/validateRequest");
const {eventEditValidationChain} = require("../validators/events");
const {ticketValidationChain} = require("../validators/tickets");

//event
router.patch('/:event_id/edit', eventEditValidationChain, validateRequest, events_controller.editEvent);
router.delete('/:event_id/delete', events_controller.deleteEvent);
router.get('/:event_id/poster',events_controller.eventPoster);
router.patch('/:event_id/upload', uploadEvent.single('photo'), events_controller.eventPosterUpload);

router.get('/', events_controller.allEvents);
router.get('/:event_id', events_controller.eventByID);
//comment
router.post('/:event_id/comments/create', events_controller.createComment);
router.get('/:event_id/comments', events_controller.allComments);
//tickets
router.post('/:event_id/create', ticketValidationChain, validateRequest, ticket.createTickets);
router.get('/:event_id/tickets', ticket.getTicketsByEvent);

//users
router.get('/:event_id/visitors', ticket.getUsers);

//promo code
router.post('/:event_id/generate_promo', events_controller.generatePromoCode);
router.post('/:event_id/check_promo',ticket.promoCode);

module.exports = router;