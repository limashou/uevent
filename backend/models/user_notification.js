const Model = require("./model");
const client = require("../db");

class User_notification extends Model{
    constructor() {
        super('user_notification');
    }
    notification(title, description,link ,user_subscribe_id){
        this.title = title;
        this.description = description;
        this.link = link;
        this.user_subscribe_id = user_subscribe_id;
        return this.insert();
    }

    async isUpdateEvents(company_id) {
        try {
            const query = `
                SELECT user_subscribe.id, companies.name
                FROM user_subscribe
                JOIN companies ON user_subscribe.company_id = companies.id
                WHERE company_id = $1
                AND update_events = TRUE;
            `;
            const values = [company_id];
            const { rows } = await client.query(query, values);
            if (rows.length === 0) {
                return false;
            }
            return rows.map(row => ({ subscribed: true, name: row.name ,user_subscribe_id: row.id }));
        } catch (error) {
            console.error("Error checking subscriptions:", error);
            return [];
        }
    }

    async isNews(company_id) {
        try {
            const query = `
                SELECT user_subscribe.id, companies.name
                FROM user_subscribe
                JOIN companies ON user_subscribe.company_id = companies.id
                WHERE company_id = $1
                AND new_news = TRUE;
            `;
            const values = [company_id];
            const { rows } = await client.query(query, values);
            if (rows.length === 0) {
                return false;
            }
            return rows.map(row => ({ subscribed: true, name: row.name ,user_subscribe_id: row.id }));
        } catch (error) {
            console.error("Error checking subscriptions:", error);
            return [];
        }
    }

    async isNewEvents(company_id) {
        try {
            const query = `
                SELECT user_subscribe.id, companies.name
                FROM user_subscribe
                JOIN companies ON user_subscribe.company_id = companies.id
                WHERE company_id = $1
                AND new_events = TRUE;
            `;
            const values = [company_id];
            const { rows } = await client.query(query, values);
            if (rows.length === 0) {
                return false;
            }
            return rows.map(row => ({ subscribed: true, name: row.name ,user_subscribe_id: row.id }));
        } catch (error) {
            console.error("Error checking subscriptions:", error);
            return [];
        }
    }

    async getNotification(user_id){
        const query = `
        SELECT *
        FROM user_notification
        JOIN user_subscribe ON user_notification.user_subscribe_id = user_subscribe.id
        WHERE user_subscribe.user_id = $1
    `;
        const values = [user_id];
        try {
            const { rows } = await client.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error:", error);
            return  false;
        }
    }
}

module.exports = User_notification;