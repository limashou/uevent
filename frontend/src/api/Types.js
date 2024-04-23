class User {
    /**
     * @param {number} id
     * @param {string} username
     * @param {string} password
     * @param {string} photo
     * @param {string} email
     * @param {string} full_name
     */
    constructor(id, username, password, photo, email, full_name) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.photo = photo;
        this.email = email;
        this.full_name = full_name;
    }
}

class Company {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} location
     * @param {number} latitude
     * @param {number} longitude
     * @param {string} description
     * @param {string} photo
     * @param {number} founder_id
     * @param {Date} creation_day
     */
    constructor(id, name, email, location, latitude, longitude, description, photo, founder_id, creation_day) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.photo = photo;
        this.founder_id = founder_id;
        this.creation_day = creation_day;
    }
}

class CompanyRole {
    /**
     * @param {number} id
     * @param {string} role_name
     * @param {boolean} event_creation
     * @param {boolean} company_edit
     * @param {boolean} news_creation
     * @param {boolean} eject_members
     */
    constructor(id, role_name, event_creation, company_edit, news_creation, eject_members) {
        this.id = id;
        this.role_name = role_name;
        this.event_creation = event_creation;
        this.company_edit = company_edit;
        this.news_creation = news_creation;
        this.eject_members = eject_members;
    }
}

class CompanyMember {
    /**
     * @param {number} id
     * @param {number} company_id
     * @param {number} member_id
     * @param {number} role_id
     */
    constructor(id, company_id, member_id, role_id) {
        this.id = id;
        this.company_id = company_id;
        this.member_id = member_id;
        this.role_id = role_id;
    }
}

class CompanyNews {
    /**
     * @param {number} id
     * @param {number} company_id
     * @param {string} poster
     * @param {string} title
     * @param {string} content
     * @param {Date} created_at
     */
    constructor(id, company_id, poster, title, content, created_at) {
        this.id = id;
        this.company_id = company_id;
        this.poster = poster;
        this.title = title;
        this.content = content;
        this.created_at = created_at;
    }
}

class Event {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} poster
     * @param {boolean} notification
     * @param {string} description
     * @param {string} location
     * @param {number} latitude
     * @param {number} longitude
     * @param {Date} date
     * @param {string} format
     * @param {string} theme
     * @param {number} company_id
     * @param {Date} created_at
     */
    constructor(id, name, poster, notification, description, location, latitude, longitude, date, format, theme, company_id, created_at) {
        this.id = id;
        this.name = name;
        this.poster = poster;
        this.notification = notification;
        this.description = description;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.format = format;
        this.theme = theme;
        this.company_id = company_id;
        this.created_at = created_at;
    }
}

class Ticket {
    /**
     * @param {number} id
     * @param {string} ticket_type
     * @param {number} price
     * @param {number} available_tickets
     * @param {string} status
     * @param {number} event_id
     */
    constructor(id, ticket_type, price, available_tickets, status, event_id) {
        this.id = id;
        this.ticket_type = ticket_type;
        this.price = price;
        this.available_tickets = available_tickets;
        this.status = status;
        this.event_id = event_id;
    }
}

class UserTicket {
    /**
     * @param {number} id
     * @param {string} ticket_status
     * @param {number} user_id
     * @param {number} ticket_id
     * @param {boolean} show_username
     * @param {Date} purchase_date
     */
    constructor(id, ticket_status, user_id, ticket_id, show_username, purchase_date) {
        this.id = id;
        this.ticket_status = ticket_status;
        this.user_id = user_id;
        this.ticket_id = ticket_id;
        this.show_username = show_username;
        this.purchase_date = purchase_date;
    }
}

class CompanyNotification {
    /**
     * @param {number} id
     * @param {string} title
     * @param {string} description
     * @param {number} company_id
     * @param {Date} date
     */
    constructor(id, title, description, company_id, date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.company_id = company_id;
        this.date = date;
    }
}

class UserSubscribe {
    /**
     * @param {number} id
     * @param {number} user_id
     * @param {number} company_id
     * @param {boolean} update_events
     * @param {boolean} new_news
     * @param {boolean} new_events
     */
    constructor(id, user_id, company_id, update_events, new_news, new_events) {
        this.id = id;
        this.user_id = user_id;
        this.company_id = company_id;
        this.update_events = update_events;
        this.new_news = new_news;
        this.new_events = new_events;
    }
}

class UserNotification {
    /**
     * @param {number} id
     * @param {string} title
     * @param {string} description
     * @param {number} user_subscribe_id
     * @param {string} link
     * @param {Date} date
     */
    constructor(id, title, description, user_subscribe_id, link, date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.user_subscribe_id = user_subscribe_id;
        this.link = link;
        this.date = date;
    }
}

class EventComment {
    /**
     * @param {number} id
     * @param {string} comment
     * @param {number} event_id
     * @param {number} user_id
     * @param {Date} created_at
     */
    constructor(id, comment, event_id, user_id, created_at) {
        this.id = id;
        this.comment = comment;
        this.event_id = event_id;
        this.user_id = user_id;
        this.created_at = created_at;
    }
}

module.exports = {
    User,
    Company,
    CompanyRole,
    CompanyMember,
    CompanyNews,
    Event,
    Ticket,
    UserTicket,
    CompanyNotification,
    UserSubscribe,
    UserNotification,
    EventComment
};
