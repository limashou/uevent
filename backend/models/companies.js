const Model = require("./model");
const client = require("../db");

class Companies extends Model {
    constructor() {
        super("companies");
    }

    create(name, email, location,latitude,longitude, founder_id,description = ''){
        this.name = name;
        this.email = email;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.founder_id = founder_id;
        return this.insert();
    }
    async findByName(stringValue) {
        const selectColumns = ['companies.id', 'companies.name'];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM companies
        JOIN users ON companies.founder_id = users.id
        WHERE LOWER(name) LIKE $1
        LIMIT 5
    `;
        const values = [`%${stringValue.toLowerCase()}%`];

        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }

    async companyName() {
        const selectColumns = ['companies.id', 'companies.name'];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM companies
    `;
        try {
            const { rows } = await client.query(query);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }

    async founderName() {
        const selectColumns = ['companies.id', 'users.full_name'];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM companies
        JOIN users ON companies.founder_id = users.id
    `;
        try {
            const { rows } = await client.query(query);
            return rows;
        } catch (error) {
            console.error("Error finding by name part:", error);
            return  false;
        }
    }

    async isFounder(founder_id, company_id){
        const query = `
        SELECT COUNT(*) 
        FROM companies 
        WHERE founder_id = $1 AND id = $2;
    `;
        const values = [founder_id, company_id];
        try {
            const { rows } = await client.query(query, values);
            return parseInt(rows[0].count) > 0;
        } catch (error) {
            console.error("Error checking founder:", error);
            return false;
        }
    }

    async getCompanyAndPermissions(userId, companyId) {
        if (!userId) {
            const companyQuery = `
            SELECT *
            FROM companies
            WHERE id = $1;
        `;
            const companyValues = [companyId];
            try {
                const { rows: [data] } = await client.query(companyQuery, companyValues);
                return { permissions: { event_creation: false, company_edit: false, news_creation: false, eject_members: false }, data };
            } catch (error) {
                console.error("Error retrieving company:", error);
                return { state: false, message: "Error retrieving company", data: { permissions: { event_creation: false, company_edit: false, news_creation: false, eject_members: false }, company: null } };
            }
        }
        const query = `
            SELECT
                jsonb_build_object(
                    'event_creation', CASE
                        WHEN u.id = (SELECT founder_id FROM companies WHERE id = $2) THEN true
                        ELSE COALESCE(cr.event_creation, false)
                        END,
                    'company_edit', CASE
                        WHEN u.id = (SELECT founder_id FROM companies WHERE id = $2) THEN true
                        ELSE COALESCE(cr.company_edit, false)
                        END,
                    'news_creation', CASE
                        WHEN u.id = (SELECT founder_id FROM companies WHERE id = $2) THEN true
                        ELSE COALESCE(cr.news_creation, false)
                        END,
                    'eject_members', CASE
                    WHEN u.id = (SELECT founder_id FROM companies WHERE id = $2) THEN true
                    ELSE COALESCE(cr.eject_members, false)
                    END
                    ) AS permissions,
                (
                    SELECT jsonb_build_object(
                        'id', c.id,
                        'name', c.name,
                        'email', c.email,
                        'location', c.location,
                        'latitude', c.latitude,
                        'longitude', c.longitude,
                        'description', c.description,
                        'photo', c.photo,
                        'founder_id', c.founder_id,
                        'creation_day', c.creation_day
                    )
                    FROM companies c
                    WHERE c.id = $2
                ) AS data
            FROM users u
                     LEFT JOIN company_members cm ON u.id = cm.member_id AND cm.company_id = $2
                     LEFT JOIN company_roles cr ON cm.role_id = cr.id
            WHERE u.id = $1;
        `;
        const values = [userId, companyId];
        try {
            const { rows } = await client.query(query, values);
            return rows[0];
        } catch (error) {
            console.error("Error retrieving company and permissions:", error);
            return [];
        }
    }
}
module.exports = Companies;