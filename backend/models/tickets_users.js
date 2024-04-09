const Model = require("./model");
const { Client } = require('pg');
const client = require("../db");
let dbClient;

class Tickets_users extends Model  {
    constructor() {
        super('user_tickets');
    }

    buy(ticket_status,user_id,ticket_id,show_username = false){
        this.ticket_status = ticket_status;
        this.user_id = user_id;
        this.ticket_id = ticket_id;
        this.show_username = show_username;
        return this.insert();
    }

    // transaction for check and decrease available tickets and update status
    async DATAUS(ticketId) {
        try {
            dbClient = new Client({
                user: 'mpoljatsky',
                host: 'localhost',
                database: 'uevent_lubiviy_poliatskiy',
                password: 'securepass',
                port: 5433,
            });

            await dbClient.connect();

            const checkQuery = `
            SELECT available_tickets
            FROM tickets
            WHERE id = $1;
        `;
            const checkValues = [ticketId];
            const checkResult = await dbClient.query(checkQuery, checkValues);

            await dbClient.query('BEGIN');

            if (checkResult.rows.length === 0 || checkResult.rows[0].available_tickets === 0) {
                const updateStatusQuery = `
                UPDATE tickets
                SET status = 'sold out'
                WHERE id = $1;
            `;
                await dbClient.query(updateStatusQuery, checkValues);
            } else {
                const updateQuery = `
                UPDATE tickets
                SET available_tickets = available_tickets - 1
                WHERE id = $1
                AND available_tickets > 0;
            `;
                await dbClient.query(updateQuery, checkValues);
            }

            await dbClient.query('COMMIT');
        } catch (error) {
            if (dbClient) {
                await dbClient.query('ROLLBACK');
                console.error('Error updating tickets:', error);
            }
            throw error;
        } finally {
            if (dbClient) {
                await dbClient.end();
            }
        }
    }

    async rollbackAvailableTickets(ticketId) {
        try {
            dbClient = new Client({
                user: 'mpoljatsky',
                host: 'localhost',
                database: 'uevent_lubiviy_poliatskiy',
                password: 'securepass',
                port: 5433,
            });

            await dbClient.connect();
            await dbClient.query('BEGIN');

            const updateQuery = `
            UPDATE tickets
            SET available_tickets = available_tickets + 1
            WHERE id = $1
            AND available_tickets > 0;
        `;
            const updateValues = [ticketId];
            await dbClient.query(updateQuery, updateValues);

            await dbClient.query('COMMIT');
        } catch (error) {
            if (dbClient) {
                await dbClient.query('ROLLBACK');
                console.error('Error updating tickets:', error);
            }
            throw error;
        } finally {
            if (dbClient) {
                await dbClient.end();
            }
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
}

module.exports = Tickets_users;