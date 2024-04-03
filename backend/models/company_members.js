const Model = require("./model");

class Company_members extends Model {
    constructor() {
        super('company_member');
    }

    create(company_id, member_id, role = 'worker') {
        this.company_id = company_id;
        this.member_id = member_id
        this.role = role
        return this.insert();
    }
}

module.exports = Company_members;