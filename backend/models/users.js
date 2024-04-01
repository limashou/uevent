const Model = require("./model");

class Users extends Model{
    constructor() {
        super("users");
    }
    registration(username, password, email, full_name){
        this.username = username;
        this.password = password;
        this.email = email;
        this.full_name = full_name;
        return this.insert();
    }
}

module.exports = Users;