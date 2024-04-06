const Model = require("./model");
const client = require("../db");

class Events extends Model {
    constructor() {
        super('events');
    }
    create(name, notification, description, date,format, theme, company_id) {
        this.name = name;
        this.notification = notification;
        this.description = description;
        this.date = date;
        this.format = format;
        this.theme = theme;
        this.company_id = company_id;
        return this.insert()
    }
    async havePermission(company_id, user_id) {
        const query = `
        SELECT COUNT(*)
        FROM (
            SELECT id, founder_id
            FROM companies
            WHERE id = $1
            AND founder_id = $2
            UNION ALL
            SELECT cm.id, cm.member_id AS founder_id
            FROM company_members cm
            JOIN users u ON cm.member_id = u.id
            WHERE cm.company_id = $1 
            AND cm.member_id = $2
            AND cm.role = 'editor'
        ) AS permissions;
    `;
        const values = [company_id, user_id];
        try {
            const { rows } = await client.query(query, values);
            return parseInt(rows[0].count) > 0;
        } catch (error) {
            console.error("Error checking permissions:", error);
            return false;
        }
    }
}

module.exports = Events;