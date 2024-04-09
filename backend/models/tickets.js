const Model = require("./model");
const Events = require("./events");
const client = require("../db");

class Tickets extends Model {
    constructor() {
        super('tickets');
    }
    createTickets(ticket_type,price, available_tickets,status,events_id) {
        this.ticket_type = ticket_type;
        this.price = price;
        this.available_tickets = available_tickets;
        this.status = status;
        this.events_id = events_id;
        return this.insert();
    }
}

module.exports = Tickets;