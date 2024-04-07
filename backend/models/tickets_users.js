const Tickets = require("./tickets");

class Tickets_users extends Tickets  {
    constructor() {
        super('user_tickets');
    }

    buy(ticket_status,user_id,ticket_id,show_username = false){
        this.ticket_status = ticket_status;
        this.user_id = user_id;
        this.ticket_id = ticket_id;
        this.show_username = show_username;
        return this.insert();
    }
}

module.exports = Tickets_users;