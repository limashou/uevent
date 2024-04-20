const client = require('../db');

class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async insert() {
        const keys = Object.keys(this)
            .filter((key) => key !== 'tableName');
        const values = keys.map(
            (key) => this[key]
        );
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${this.tableName} (${keys.join(', ')})
                       VALUES (${placeholders})
                       RETURNING id`;

        try {
            const {rows} = await client.query(query, values);
            return rows[0].id;
        } catch (error) {
            throw error;
        }
    }

    async find(conditions = {}) {
        const whereClauses = [];
        const values = [];

        for (const key in conditions) {
            whereClauses.push(`${key} = $${values.length + 1}`);
            values.push(conditions[key]);
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const query = `SELECT *
                       FROM ${this.tableName} ${whereClause}`;

        try {
            const {rows} = await client.query(query, values);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async find_with_sort(conditions = {}) {
        const {join, group, field, order, size, page, filters} = conditions;
        const whereClauses = [];
        const values = [];

        for (const key in conditions) {
            if (!['join', 'group', 'field', 'order', 'size', 'page', 'filters'].includes(key)) {
                whereClauses.push(`${key} = $${values.length + 1}`);
                values.push(conditions[key]);
            }
        }

        if (Array.isArray(filters)) {
            filters.forEach(filter => {
                whereClauses.push(filter);
            });
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const orderClause = field && order ? `ORDER BY ${field} ${order}` : '';
        const limitClause = size && page ? `LIMIT ${size} OFFSET ${(page - 1) * size}` : '';

        const countQuery = `SELECT COUNT(*) as count
                            FROM (${join ? join : `SELECT *
                                                   FROM ${this.tableName}`} ${whereClause} ${group ? group : ''}) AS subquery`;
        const dataQuery = `${join ? join : `SELECT *
                                            FROM ${this.tableName}`} ${whereClause} ${group ? group : ''} ${orderClause} ${limitClause}`;

        try {
            const countResult = await client.query(countQuery, values);
            const totalCount = Number.parseInt(countResult.rows[0].count);

            const rows = await client.query(dataQuery, values);

            const totalPages = Math.ceil(totalCount / size);
            const currentPage = Number.parseInt(page) || 1;

            return {rows: rows.rows, totalCount, totalPages, currentPage};
        } catch (error) {
            throw error;
        }
    }

    async deleteRecord(conditions = {}) {
        const whereClauses = [];
        const values = [];

        for (const key in conditions) {
            whereClauses.push(`${key} = $${values.length + 1}`);
            values.push(conditions[key]);
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const query = `DELETE
                       FROM ${this.tableName} ${whereClause}`;

        try {
            const result = await client.query(query, values);
            return result.rowCount; // Возвращаем количество удаленных строк
        } catch (error) {
            throw error;
        }
    }

    async updateById(updatedFields) {
        updatedFields = Object.fromEntries(
            Object.entries(updatedFields).filter(([key, value]) => value !== null && value !== undefined)
        );
        const keys = Object.keys(updatedFields).filter(key => key !== 'id');
        const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = keys.map(key => updatedFields[key]);

        if (!updatedFields.id) {
            throw new Error('Не указан идентификатор (id) для обновления записи.');
        }

        const query = `UPDATE ${this.tableName}
                       SET ${setClauses}
                       WHERE id = $${keys.length + 1}`;
        values.push(updatedFields.id);

        try {
            const result = await client.query(query, values);
            return result.rowCount; // Возвращаем количество обновленных строк
        } catch (error) {
            throw error;
        }
    }

    async loadEnumValues(enumName) {
        const query = `
        SELECT unnest(enum_range(NULL::${enumName}))
    `;
        try {
            const result = await client.query(query);
            return result.rows.map(row => row.unnest);
        } catch (error) {
            console.error(`Error loading enum values for ${enumName} from database:`, error);
            throw error;
        }
    }
}
module.exports = Model;
