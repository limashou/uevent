const Model = require("./model");
const client = require("../db");

class Company_news extends Model {

    constructor() {
        super('company_news');
    }

    crate(company_id,title,content) {
        this.company_id = company_id;
        this.title = title;
        this.content = content;
        return this.insert();
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
            AND (cm.role = 'news_maker' OR cm.role = 'editor')
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

module.exports = Company_news;