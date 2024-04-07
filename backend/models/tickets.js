const Model = require("./model");
const Events = require("./events");
const client = require("../db");

class Tickets extends Model,Events {
    constructor() {
        super('tickets');
    }
    createTickets(event_id,ticket_type,price, available_tickets) {
        this.event_id = event_id;
        this.ticket_type = ticket_type;
        this.price = price;
        this.available_tickets = available_tickets;
        return this.insert();
    }
// transaction for check and decrease available tickets and update status
    async DATAUS(ticketId) {
        try {
            await client.query('BEGIN');

            const checkQuery = `
                SELECT available_tickets
                FROM tickets
                WHERE id = $1;
            `;
            const checkValues = [ticketId];
            const checkResult = await client.query(checkQuery, checkValues);

            if (checkResult.rows.length === 0 || checkResult.rows[0].available_tickets === 0) {
                const updateStatusQuery = `
                UPDATE tickets
                SET status = 'sold out'
                WHERE id = $1;
            `;
                await client.query(updateStatusQuery, checkValues);
            } else {
                const updateQuery = `
                UPDATE tickets
                SET available_tickets = available_tickets - 1
                WHERE id = $1
                    AND available_tickets > 0;
            `;
                await client.query(updateQuery, checkValues);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating tickets:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = Tickets;