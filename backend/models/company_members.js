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

    async  getAllCompanyUsers(company_id) {
        const query = `
        SELECT users.id, users.full_name, 'founder' AS role_name, NULL AS worked_from, NULL AS role_id 
        FROM users 
        JOIN companies c ON users.id = c.founder_id
        WHERE c.id = $1
        UNION
        SELECT u.id, u.full_name, cr.role_name, company_members.worked_from, cr.id AS role_id
        FROM users u
        JOIN company_members ON u.id = company_members.member_id
        JOIN company_roles cr ON company_members.role_id = cr.id
        WHERE company_members.company_id = $1;
    `;
        const values = [company_id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error retrieving company users:", error);
            return [];
        }
    }
}
module.exports = Company_members;