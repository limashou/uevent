const Model = require("./model");

class Companies extends Model {
    constructor() {
        super("companies");
    }
    create(name, email, location, founder_id){
        this.name = name;
        this.email = email;
        this.location = location;
        this.founder_id = founder_id;
        return this.insert();
    }
    
}
module.exports = Companies;