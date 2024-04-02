const Companies = require('../models/companies');
const Response = require('../models/response')
async function createCompanies(req, res) {
    try {
        let company = new Companies();
        const { name, email, location } = req.body;
        if (name === undefined || email === undefined || location === undefined) {
            res.json(new Response(false, "Some parameters are missing"));
            return;
        }
        const result = await company.create(name, email, location, req.senderData.id);
        res.json(new Response(true, "Company created successfully", result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}


module.exports = {
    createCompanies
}