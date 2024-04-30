const Model = require("./model");

class Promo_codes extends Model {
    constructor() {
        super('promo_codes');
    }
    code(code,sale ,event_id){
        this.code = code;
        this.sale = sale;
        this.event_id = event_id;
        return this.insert();
    }
}

module.exports = User_subscribe;