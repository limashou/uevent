const Model = require("./model");
const client = require("../db");

class Tickets_users extends Model {
    constructor() {
        super('user_tickets');
    }

    buy(ticket_status, user_id, ticket_id, show_username = false, session_id = null) {
        this.ticket_status = ticket_status;
        this.user_id = user_id;
        this.ticket_id = ticket_id;
        this.show_username = show_username;
        this.session_id = session_id;
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

            if (checkResult.rows.length === 0 || checkResult.rows[0].available_tickets === 0) {
                soldOut = true;
            } else {
                const updateQuery = `
                    UPDATE tickets
                    SET available_tickets = available_tickets - 1,
                        status = CASE WHEN available_tickets - 1 = 0 THEN 'sold out' ELSE status END
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

    async getInformationById(id) {
        const selectColumns = [
            'events.id AS event_id',
            'events.name',
            'events.date',
            'events.location',
            'events.format',
            'events.theme',
            'tickets.ticket_type',
            'tickets.price',
            'user_tickets.ticket_status',
            'users.full_name'
            // 'CASE WHEN user_tickets.show_username THEN users.full_name ELSE \'visitor\' END AS user_name'
        ];
        const query = `
            SELECT ${selectColumns.join(', ')}
            FROM user_tickets
                     JOIN users ON user_tickets.user_id = users.id
                     JOIN tickets ON user_tickets.ticket_id = tickets.id
                     JOIN events ON tickets.event_id = events.id
            WHERE user_tickets.id = $1
        `;
        const values = [id];
        try {
            const {rows} = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return false;
        }
    }

    async isNotificationEnabled(ticketId) {
        const query = `
            SELECT e.notification
            FROM events e
                     JOIN tickets t ON e.id = t.event_id
            WHERE t.id = $1;
        `;
        const values = [ticketId];
        try {
            const {rows} = await client.query(query, values);
            return rows.length > 0 ? rows[0].notification : false;
        } catch (error) {
            console.error("Error checking notification:", error);
            return false;
        }
    }

    async getInformation(ticketId, user_id) {
        const selectColumns = ['events.name', 'events.company_id', 'users.full_name', 'tickets.ticket_type'];
        const query = `
            SELECT ${selectColumns.join(', ')}
            FROM tickets
                     JOIN users ON users.id = $2
                     JOIN events ON tickets.event_id = events.id
            WHERE tickets.id = $1
        `;
        const values = [ticketId, user_id];
        try {
            const {rows} = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return false;
        }
    }

    async getUserByEventId(event_id) {
        const query = `
        SELECT 
            ut.id AS user_ticket_id,
            ut.user_id,
            t.ticket_type,
            u.full_name AS full_name
        FROM user_tickets ut
        JOIN users u ON ut.user_id = u.id
        JOIN tickets t ON ut.ticket_id = t.id
        WHERE t.event_id = $1
        AND ut.show_username = true
    `;

        const visitorCountQuery = `
        SELECT 
            t.ticket_type,
            COUNT(*) AS visitor_count
        FROM user_tickets ut
        JOIN tickets t ON ut.ticket_id = t.id
        WHERE t.event_id = $1
        AND ut.show_username = false
        GROUP BY t.ticket_type
    `;

        const values = [event_id];

        try {
            const { rows } = await client.query(query, values);
            const { rows: visitorCounts } = await client.query(visitorCountQuery, values);
            const visitorCountMap = {};
            visitorCounts.forEach((row) => {
                visitorCountMap[row.ticket_type] = row.visitor_count;
            });

            return {
                users: rows,
                visitorCounts: visitorCountMap
            };
        } catch (error) {
            console.error("Error finding users by event ID:", error);
            return false;
        }
    }



    async check(user_id, event_id) {
        const query = `
        SELECT ut.id, ut.session_id, ut.ticket_status, t.id AS ticket_id
        FROM user_tickets ut
        JOIN tickets t ON ut.ticket_id = t.id
        WHERE ut.user_id = $1
          AND t.event_id = $2
        LIMIT 1
    `;
        const values = [user_id, event_id];
        try {
            const { rows } = await client.query(query, values);
            if (rows.length > 0) {
                let data = { exists: true, user_ticket_id: rows[0].id };
                if (rows[0].ticket_status === 'reserved'){
                    data.ticket_status = 'reserved'
                    data.session_id = rows[0].session_id;
                    data.ticket_id = rows[0].ticket_id
                }
                return data;
            } else {
                return { exists: false };
            }
        } catch (error) {
            console.error("Error checking user ticket:", error);
            return { exists: false, error: error.toString() };
        }
    }


    async getAllTickets(user_id, page = 1, size = 10) {
        const offset = (page - 1) * size;
        const query = `
            SELECT events.id, events.name, user_tickets.id AS user_ticket_id, events.date, tickets.ticket_type, user_tickets.ticket_status, 
                   user_tickets.purchase_date,
                   CASE
                       WHEN user_tickets.ticket_status = 'reserved' THEN user_tickets.session_id
                       ELSE NULL
                       END AS session_id
            FROM events
                     JOIN tickets ON events.id = tickets.event_id
                     JOIN user_tickets ON tickets.id = user_tickets.ticket_id
            WHERE user_tickets.user_id = $1
            LIMIT $2 OFFSET $3
        `;
        const values = [user_id, size, offset];
        try {
            const {rows} = await client.query(query, values);

            const countQuery = `
                SELECT COUNT(*)
                FROM user_tickets
                         JOIN tickets ON user_tickets.ticket_id = tickets.id
                         JOIN events ON tickets.event_id = events.id
                WHERE user_tickets.user_id = $1
            `;
            const {rows: countRows} = await client.query(countQuery, [user_id]);
            const totalCount = parseInt(countRows[0].count, 10);
            const totalPages = Math.ceil(totalCount / size);

            return {
                tickets: rows,
                totalCount,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            console.error("Error retrieving tickets:", error);
            return false;
        }
    }

}

module.exports = Tickets_users;