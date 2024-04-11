const Model = require("./model");
const client = require("../db");

class Company_members extends Model {
    constructor() {
        super('company_members');
    }

    create(company_id, member_id, role_id = 4) {
        this.company_id = company_id;
        this.member_id = member_id
        this.role_id = role_id
        return this.insert();
    }

    async getAllCompanyUsers(company_id) {
        const query = `
        SELECT DISTINCT ON (u.id)
            jsonb_build_object(
                'id', u.id,
                'full_name', u.full_name,
                'email', u.email,
                'role', CASE
                        WHEN u.id = c.founder_id THEN 'Founder'
                        ELSE cr.role_name
                        END
            ) AS data,
            jsonb_build_object(
                'event_creation', CASE
                    WHEN u.id = c.founder_id THEN true
                    ELSE cr.event_creation
                    END,
                'company_edit', CASE
                    WHEN u.id = c.founder_id THEN true
                    ELSE cr.company_edit
                    END,
                'news_creation', CASE
                    WHEN u.id = c.founder_id THEN true
                    ELSE cr.news_creation
                    END,
                'eject_members', CASE
                    WHEN u.id = c.founder_id THEN true
                    ELSE cr.eject_members
                    END
            ) AS permissions
        FROM users u
        JOIN companies c ON u.id = c.founder_id OR u.id IN (SELECT member_id FROM company_members WHERE company_id = $1)
        LEFT JOIN company_members cm ON u.id = cm.member_id
        LEFT JOIN company_roles cr ON cm.role_id = cr.id
        WHERE c.id = $1
        ORDER BY u.id, cm.id;
    `;
        const values = [company_id];
        try {
            const { rows } = await client.query(query, values);
            return rows.map(row => ({
                data: row.data,
                permissions: row.permissions
            }));
        } catch (error) {
            console.error("Error retrieving company users:", error);
            return [];
        }
    }
}
module.exports = Company_members;