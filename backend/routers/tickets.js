const Router = require('express')
const ticket = require('../controllers/TicketsController');
const router = new Router;

router.patch('/:ticket_id/edit', ticket.editTickets)
router.delete('/:ticket_id/delete', ticket.removeTickets);
router.post('/:ticket_id/buy', ticket.buyTicket);
router.post('/:ticket_id/reserve', ticket.reservedTicket);
router.delete('/:ticket_id/cancel', ticket.cancelTicket);

router.get('/information/:user_ticket_id',ticket.informationByTicket);
module.exports = router;