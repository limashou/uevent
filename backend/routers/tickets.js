const Router = require('express')
const ticket = require('../controllers/TicketsController');
const router = new Router;


router.post('/:event_id/tickets/create',ticket.creteTickets);
router.patch('/:event_id/tickets/edit',ticket.editTickets)
router.delete('/:event_id/tickets/delete/:id',ticket.removeTickets);
router.post('/:event_id/tickets/buy/:ticket_id',ticket.buyTicket);
router.get('/information/:id',ticket.informationByTicket);
module.exports = router;