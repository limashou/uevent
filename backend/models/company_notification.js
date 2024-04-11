const Model = require("./model");

class Company_notification extends Model {
    constructor() {
        super('company_notification');
    }
    create(title, description, company_id, date){
        this.title = title;
        this.description = description;
        this.company_id = company_id;
        this.date = date;
        return this.insert();
    }
}

module.exports = Company_notification;