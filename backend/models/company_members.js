const Model = require("./model");
const client = require("../db");

class Company_members extends Model {
    constructor() {
        super('company_member');
    }

    create(company_id, member_id, role = 'worker') {
        this.company_id = company_id;
        this.member_id = member_id
        this.role = role
        return this.insert();
    }

    async  getAllCompanyUsers(company_id) {
        const query = `
        SELECT u.id, u.full_name, u.email, 'founder' AS role
        FROM users u
        JOIN companies c ON u.id = c.founder_id
        WHERE c.id = $1
        UNION
        SELECT u.id, u.full_name, u.email, cm.role
        FROM users u
        JOIN company_members cm ON u.id = cm.member_id
        WHERE cm.company_id = $1;
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