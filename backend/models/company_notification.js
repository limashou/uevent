const Model = require("./model");
const client = require("../db");

class Company_notification extends Model {
    constructor() {
        super('company_notification');
    }
    create(title, description, company_id, date){
        this.title = title;
        this.description = description;
        this.company_id = company_id;
        this.date = date;
        return this.insert();
    }

    async isMember(company_id, user_id) {
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

module.exports = Company_notification;