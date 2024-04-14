const Router = require('express')
const ticket = require('../controllers/TicketsController');
const router = new Router;

router.patch('/:ticket_id/edit',ticket.editTickets)
router.delete('/:ticket_id/delete',ticket.removeTickets);
router.post('/buy/:ticket_id',ticket.buyTicket);
router.delete('/:ticket_id/cancel',ticket.cancelTicket);

router.get('/information/:id',ticket.informationByTicket);
module.exports = router;