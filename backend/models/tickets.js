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

    async get(ticket_id){
        const query = `
        SELECT tickets.ticket_type, events.name, tickets.price
        FROM tickets
        JOIN events ON tickets.event_id = events.id
        WHERE tickets.id = $1
        `;
        const values = [ticket_id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error:", error);
            return  false;
        }
    }
}

module.exports = Tickets;