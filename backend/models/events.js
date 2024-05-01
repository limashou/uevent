const Model = require("./model");
const client = require("../db");

class Events extends Model {
    constructor() {
        super('events');
    }

    create(name, notification, description, location, latitude, longitude, date, format, theme, company_id) {
        this.name = name;
        this.notification = notification;
        this.description = description;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.format = format;
        this.theme = theme;
        this.company_id = company_id;
        return this.insert()
    }

    async havePermission(company_id, user_id) {
        const query = `
            SELECT COUNT(*)
            FROM (SELECT id, founder_id
                  FROM companies
                  WHERE id = $1
                    AND founder_id = $2
                  UNION ALL
                  SELECT cm.id, cm.member_id AS founder_id
                  FROM company_members cm
                           JOIN users u ON cm.member_id = u.id
                           JOIN company_roles ON cm.role_id = company_roles.id
                  WHERE cm.company_id = $1
                    AND cm.member_id = $2
                    AND company_roles.role_name = 'editor') AS permissions;
        `;
        const values = [company_id, user_id];
        try {
            const {rows} = await client.query(query, values);
            return parseInt(rows[0].count) > 0;
        } catch (error) {
            console.error("Error checking permissions:", error);
            return false;
        }
    }

    async getEvent(event_id, user_id) {
        const defaultPermissions = {
            event_creation: false,
            company_edit: false,
            news_creation: false,
            eject_members: false,
        };

        if (!user_id) {
            const companyQuery = `
                SELECT events.id,
                       events.name,
                       companies.name AS company_name,
                       events.company_id,
                       events.description,
                       events.location,
                       events.latitude,
                       events.longitude,
                       events.date,
                       events.format,
                       events.theme
                FROM events
                         JOIN companies on companies.id = events.company_id
                WHERE events.id = $1;
            `;
            const eventsValues = [event_id];
            try {
                const {rows: [data]} = await client.query(companyQuery, eventsValues);
                return {
                    permissions: defaultPermissions,
                    data,
                };
            } catch (error) {
                console.error("Error retrieving event:", error);
                return {
                    state: false,
                    message: "Error retrieving event",
                    data: {permissions: defaultPermissions, data: null},
                };
            }
        }

        const query = `
            SELECT jsonb_strip_nulls(
                           jsonb_build_object(
                                   'permissions', jsonb_build_object(
                                   'event_creation', CASE
                                                         WHEN u.id = (SELECT founder_id
                                                                      FROM companies
                                                                      WHERE id = (SELECT company_id
                                                                                  FROM events
                                                                                  WHERE id = $2))
                                                             THEN true
                                                         ELSE COALESCE(cr.event_creation, false)
                                       END,
                                   'company_edit', CASE
                                                       WHEN u.id = (SELECT founder_id
                                                                    FROM companies
                                                                    WHERE id = (SELECT company_id
                                                                                FROM events
                                                                                WHERE id = $2))
                                                           THEN true
                                                       ELSE COALESCE(cr.company_edit, false)
                                       END,
                                   'news_creation', CASE
                                                        WHEN u.id = (SELECT founder_id
                                                                     FROM companies
                                                                     WHERE id = (SELECT company_id
                                                                                 FROM events
                                                                                 WHERE id = $2))
                                                            THEN true
                                                        ELSE COALESCE(cr.news_creation, false)
                                       END,
                                   'eject_members', CASE
                                                        WHEN u.id = (SELECT founder_id
                                                                     FROM companies
                                                                     WHERE id = (SELECT company_id
                                                                                 FROM events
                                                                                 WHERE id = $2))
                                                            THEN true
                                                        ELSE COALESCE(cr.eject_members, false)
                                       END
                               ),
                                   'data', (SELECT jsonb_build_object(
                                                           'id', events.id,
                                                           'company_name', c.name,
                                                            'company_id', c.id,
                                                           'name', events.name,
                                                           'description', events.description,
                                                           'location', events.location,
                                                           'latitude', events.latitude,
                                                           'longitude', events.longitude,
                                                           'date', events.date,
                                                           'format', events.format,
                                                           'theme', events.theme
                                                       )
                                            FROM events
                                                     JOIN companies c on c.id = events.company_id
                                            WHERE events.id = $2)
                               )
                       ) AS response
            FROM users u
                     LEFT JOIN company_members cm ON u.id = cm.member_id AND cm.company_id = (SELECT company_id
                                                                                              FROM events
                                                                                              WHERE id = $2)
                     LEFT JOIN company_roles cr ON cm.role_id = cr.id
            WHERE u.id = $1;
        `;

        const values = [user_id, event_id];
        try {
            const {rows: [result]} = await client.query(query, values);
            return result.response;
        } catch (error) {
            console.error("Error retrieving company and permissions:", error);
            return [];
        }
    }
}

module.exports = Events;