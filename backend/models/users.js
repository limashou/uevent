const Model = require("./model");
const client = require("../db");

class Users extends Model{
    constructor() {
        super("users");
    }
    registration(username, password, email, full_name){
        this.username = username;
        this.password = password;
        this.email = email;
        this.full_name = full_name;
        return this.insert();
    }
    async findByFullName(user_ids_to_exclude, stringValue) {
        const selectColumns = ['id', 'email', 'full_name'];
        const idPlaceholders = user_ids_to_exclude.map(() => '?').join(',');

        let query = `
        SELECT ${selectColumns.join(', ')}
        FROM users
        WHERE LOWER(full_name) LIKE $1
    `;
        const values = [`%${stringValue.toLowerCase()}%`];

        if (user_ids_to_exclude.length > 0) {
            query += `
            AND id <> ANY($2::int[])
            LIMIT 5
        `;
            values.push(user_ids_to_exclude);
        } else {
            query += `
            LIMIT 5
        `;
        }

        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async userCompanies(user_id) {
        const query = `
        SELECT
            companies.id AS company_id,
            companies.name,
            CASE 
                WHEN companies.founder_id = $1 THEN 'founder'
                ELSE company_roles.role_name 
            END AS role,
            company_members.worked_from
        FROM companies
        LEFT JOIN company_members ON companies.id = company_members.company_id
        LEFT JOIN company_roles ON company_members.role_id = company_roles.id
        WHERE companies.founder_id = $1 OR company_members.member_id = $1
    `;

        const values = [user_id];

        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error in userCompanies:", error);
            throw error;
        }
    }
}

module.exports = Users;