const Events = require('../models/events');
const Company = require('../models/companies');
const Response = require("../models/response");

/** /=======================/events function /=======================/ */

async function createEvent(req,res){
    try {
        let event = new Events();
        const { company_id } = req.params;
        const {name, notification, description, date, format, theme} = req.body;
        if (name === undefined || date === undefined || format === undefined || theme === undefined) {
            return res.json(new Response(false, "Some parameters are missing"));
        }
        if(!(await event.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const result = await event.create(name, notification, description, date, format, theme ,company_id);
        res.json(new Response(true,"Event create" , result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editEvent(req,res){
    try {
        let event = new Events();
        const { company_id } = req.params;
        const {id, name, notification, description, date, format, theme} = req.body;

        if(!(await event.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }

        const foundEvent = await event.find({ id: id });
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }

        let updatedFields = { name, notification, description, date, format, theme };
        await event.updateById( { id: foundEvent[0].id, ...updatedFields });
        res.json(new Response(true,"Successfully update"),foundEvent[0].id);
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function deleteEvent(req,res){
    try {
        const {company_id, id} = req.params
        const event = new Events();

        if(!(await event.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false, "Not enough permission"));
        }

        let foundEvent = await event.find({id: id});
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        await event.deleteRecord({ id: foundEvent[0].id });
        res.json(new Response(true,"Deleted"));
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function allEvents(req,res){
    try {
        const { company_id } = req.params
        const events = new Events();
        const {page,limit, order} = req.query;

        if(page < 1 ) {
            return res.json(new Response(false,"incorrect page, page must be more or equals than 1, but your page " + page));
        }
        let allCompanies;
        if(order === undefined){
             allCompanies = await events.find_with_sort({ company_id: company_id, page: page, size: limit});
        }else {
             allCompanies = await events.find_with_sort({ company_id: company_id, page: page, size: limit, order: order, field: "date" });
        }

        const filteredEvents = allCompanies.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date,format, theme}));
        res.json(new Response(true, "All events by page" + page, filteredEvents));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function eventByID(req,res){
    try {
        const { company_id, id } = req.params
        const event = new Events()

        let foundEvent = await event.find({id: id});
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        const filteredEvent = foundEvent.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date, format, theme}));
        res.json(new Response(true,"Event by id "+ id, filteredEvent[0]));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

module.exports = {
    // event
    createEvent,
    editEvent,
    deleteEvent,
    allEvents,
    eventByID
}