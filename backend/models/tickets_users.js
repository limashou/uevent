const Model = require("./model");
const client = require("../db");

class Tickets_users extends Model  {
    constructor() {
        super('user_tickets');
    }

    buy(ticket_status,user_id,ticket_id,show_username = false,purchase_token = null) {
        this.ticket_status = ticket_status;
        this.user_id = user_id;
        this.ticket_id = ticket_id;
        this.show_username = show_username;
        this.purchase_token = purchase_token;
        return this.insert();
    }

    // transaction for check and decrease available tickets and update status
    async DATAUS(ticketId) {
        let soldOut = false;
        try {

            const checkQuery = `
            SELECT available_tickets
            FROM tickets
            WHERE id = $1;
        `;
            const checkValues = [ticketId];
            const checkResult = await client.query(checkQuery, checkValues);

            await client.query('BEGIN');

            if (checkResult.rows.length === 1 || checkResult.rows[0].available_tickets === 0) {
                const updateStatusQuery = `
                UPDATE tickets
                SET status = 'sold out'
                WHERE id = $1;`;

                await client.query(updateStatusQuery, checkValues);
                soldOut = true;
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
            if (client) {
                await client.query('ROLLBACK');
                console.error('Error updating tickets:', error);
            }
            throw error;
        }
        return soldOut;
    }

    async rollbackAvailableTickets(ticketId) {
        try {
            await client.query('BEGIN');

            const updateQuery = `
            UPDATE tickets
            SET available_tickets = available_tickets + 1
            WHERE id = $1
            AND available_tickets > 0;
        `;
            const updateValues = [ticketId];
            await client.query(updateQuery, updateValues);

            await client.query('COMMIT');
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
                console.error('Error updating tickets:', error);
            }
            throw error;
        }
    }

    async getInformationById(id){
        const selectColumns = ['events.name',
            'events.date',
            'events.format',
            'events.theme',
            'tickets.ticket_type',
            'tickets.price',
            'user_tickets.ticket_status',
            'CASE WHEN user_tickets.show_username THEN users.full_name ELSE \'visitor\' END AS user_name'
        ];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM user_tickets
        JOIN users ON user_tickets.user_id = users.id
        JOIN tickets ON user_tickets.ticket_id = tickets.id
        JOIN events ON tickets.events_id = events.id
        WHERE user_tickets.id = $1
    `;
        const values = [id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }

    async isNotificationEnabled(ticketId) {
        const query = `
        SELECT e.notification
        FROM events e
        JOIN tickets t ON e.id = t.events_id
        WHERE t.id = $1;
    `;
        const values = [ticketId];
        try {
            const { rows } = await client.query(query, values);
            return rows.length > 0 ? rows[0].notification : false;
        } catch (error) {
            console.error("Error checking notification:", error);
            return false;
        }
    }
    async getInformation(ticketId,user_id){
        const selectColumns = ['events.name','events.company_id','users.full_name','tickets.ticket_type'];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM tickets
        JOIN users ON users.id = $2
        JOIN events ON tickets.events_id = events.id
        WHERE tickets.id = $1
    `;
        const values = [ticketId,user_id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }

    async getUserByEventId(event_id){
        const query = `
            SELECT
                ut.id AS user_ticket_id,
                ut.user_id,
                t.ticket_type,
                CASE
                    WHEN ut.show_username THEN u.full_name
                    ELSE 'visitor'
                    END AS full_name
            FROM
                user_tickets ut
                    JOIN
                users u ON ut.user_id = u.id
                    JOIN
                tickets t ON ut.ticket_id = t.id
            WHERE
                t.events_id = $1;
        `;

        const values = [event_id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }
}

module.exports = Tickets_users;