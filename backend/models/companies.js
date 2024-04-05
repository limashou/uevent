const Model = require("./model");
const client = require("../db");

class Companies extends Model {
    constructor() {
        super("companies");
    }
    create(name, email, location,founder_id,description = ''){
        this.name = name;
        this.email = email;
        this.location = location;
        this.description = description;
        this.founder_id = founder_id;
        return this.insert();
    }
    async findByName(stringValue) {
        const selectColumns = ['id', 'name'];
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM companies
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

}
module.exports = Companies;