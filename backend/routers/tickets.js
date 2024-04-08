const Router = require('express')
const ticket = require('../controllers/TicketsController');
const router = new Router;


router.post('/:event_id/tickets/create',ticket.creteTickets);
router.patch('/:event_id/tickets/edit',ticket.editTickets)
router.delete('/:event_id/tickets/delete/:id',ticket.removeTickets);
router.post('/:event_id/tickets/buy',ticket.buyTicket);

module.exports = router;