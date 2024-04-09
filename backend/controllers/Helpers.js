const nodemailer = require("nodemailer");

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
                key: 'AIzaSyBiLO8sTBOT-joj93cqKKMXdfP8ZM5BeUM'
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
module.exports = {
    transporter,
    generateCode,
    getLocationData
}
