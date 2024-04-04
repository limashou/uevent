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
        const query = `
        SELECT ${selectColumns.join(', ')}
        FROM users
        WHERE LOWER(full_name) LIKE $1
        AND id <> ANY($2::int[])
        LIMIT 5
    `;
        const values = [`%${stringValue.toLowerCase()}%`, user_ids_to_exclude];

        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = Users;