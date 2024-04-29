const Model = require("./model");
const client = require("../db");

class User_notification extends Model {
    constructor() {
        super('user_notification');
    }
    notification(user_subscribe_id, notification_id) {
        this.user_subscribe_id = user_subscribe_id;
        this.notification_id = notification_id;
        return this.insert();
    }
}

module.exports = User_notification;