const Model = require("./model");

class Event_comments extends Model {
    constructor() {
        super('event_comments');
    }

    create(comment, event_id,user_id){
        this.comment = comment;
        this.event_id = event_id;
        this.user_id = user_id;
        return this.insert();
    }
}

module.exports = Event_comments;