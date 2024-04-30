const nodemailer = require("nodemailer");
const client = require("../db");

/** /=======================/ nodemailer transporter /=======================/ */

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'javawebtempmail@gmail.com',
        pass: 'ljgw wsww hvod tkpz'
    }
});

/** /=======================/ generate code /=======================/ */

function generateCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

/** /=======================/location from string function /=======================/ */

async function getLocationData(address) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
            params: {
                input: address,
                inputtype: 'textquery',
                fields: 'formatted_address,name,geometry',
                key: '-'
            }
        });

        const place = response.data.candidates[0];
        console.log(response.data);
        if (!place || !place.formatted_address || !place.geometry) {
            throw new Error('Invalid or missing place data');
        }

        const { formatted_address, geometry } = place;
        const { location } = geometry;

        const { lat, lng } = location;
        const addressComponents = formatted_address.match(/[^,]+/g);
        const streetAddress = addressComponents[0] + addressComponents[1];
        const city = addressComponents[2];
        const state = addressComponents[3];
        const country = addressComponents[4];
        const postalCode = addressComponents[5];

        return {
            street_address: streetAddress,
            city: city,
            state: state,
            country: country,
            postal_code: postalCode,
            latitude: lat,
            longitude: lng
        };
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null;
    }
}

async function removeOldReservedTickets() {
    try {
        const { rows: ticketIds } = await client.query(
            "SELECT ticket_id FROM user_tickets WHERE ticket_status = 'reserved' AND purchase_date <= NOW() - INTERVAL '10 minutes';"
        );
        const result = await client.query(
            "DELETE FROM user_tickets WHERE ticket_status = 'reserved' AND purchase_date <= NOW() - INTERVAL '10 minutes';"
        );
        console.log(`Удалено записей: ${result.rowCount}`);
        if (result.rowCount > 0) {
            const ticketCountMap = ticketIds.reduce((acc, row) => {
                acc[row.ticket_id] = (acc[row.ticket_id] || 0) + 1;
                return acc;
            }, {});
            for (const [ticket_id, count] of Object.entries(ticketCountMap)) {
                await client.query(
                    "UPDATE tickets SET available_tickets = available_tickets + $1 WHERE id = $2",
                    [count, ticket_id]
                );
            }
            console.log(`Обновлено количество доступных билетов.`);
        }
    } catch (error) {
        console.error('Ошибка при удалении записей:', error);
    }
}

module.exports = {
    transporter,
    generateCode,
    getLocationData,
    removeOldReservedTickets
}
