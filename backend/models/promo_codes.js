const Model = require("./model");

class Promo_codes extends Model {
    constructor() {
        super('promo_codes');
    }
    code(code, discount, discount_type, event_id,valid_to){
        this.code = code;
        this.discount = discount;
        this.discount_type = discount_type;
        this.event_id = event_id;
        this.valid_to = valid_to;
        return this.insert();
    }
}

module.exports = Promo_codes;