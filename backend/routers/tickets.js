const Router = require('express')
const ticket = require('../controllers/TicketsController');
const router = new Router;


router.post('/:event_id/create',ticket.creteTickets);
router.patch('/:event_id/edit',ticket.editTickets)
router.delete('/:event_id/ticket/:ticket_id/delete',ticket.removeTickets);
router.get('/:event_id/all', ticket.getTicketsByEvent);
router.post('/:event_id/tickets/buy/:ticket_id',ticket.buyTicket);
router.delete('/:event_id/user/:ticket_id/cancel',ticket.cancelTicket);

router.get('/information/:id',ticket.informationByTicket);
module.exports = router;