const Model = require("./model");

class User_subscribe extends Model {
    constructor() {
        super('user_subscribe');
    }
    subscribe(user_id, company_id, update_events, new_news, new_events){
        this.user_id = user_id;
        this.company_id = company_id;
        this.update_events = update_events;
        this.new_news = new_news;
        this.new_events = new_events;
        return this.insert();
    }
}

module.exports = User_subscribe;