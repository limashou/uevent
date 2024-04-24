const Model = require("./model");
const Events = require("./events");
const client = require("../db");

class Tickets extends Model {
    constructor() {
        super('tickets');
    }
    createTickets(ticket_type,price, available_tickets,status,event_id) {
        this.ticket_type = ticket_type;
        this.price = price;
        this.available_tickets = available_tickets;
        this.status = status;
        this.event_id = event_id;
        return this.insert();
    }
}

module.exports = Tickets;