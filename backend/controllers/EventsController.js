const Events = require('../models/events');
const EventComments = require('../models/event_comments');
const Response = require("../models/response");
const {getLocationData} = require("./Helpers");

async function Location(req, res) {
    try {
        const { string_location } = req.body;
        const location = await getLocationData(string_location);
        console.log(location);
        res.json(new Response(true, "location array", location));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
/** /=======================/events function /=======================/ */

async function createEvent(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
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
        const { company_id, id } = req.params;
        const { name, notification, description, date, format, theme} = req.body;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
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
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
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

async function allEventsByCompany(req,res){
    try {
        const { company_id } = req.params
        const events = new Events();
        const {
            page = 1,
            limit = 20,
            field = 'date',
            order = 'ASC',
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        let allEvents = await events.find_with_sort({
                 company_id: company_id,
                 page: page,
                 size: limit,
                 order: order,
                 field: field,
             });
        const filteredEvents = allEvents.rows.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date,format, theme}));
        res.json(new Response(true, "All events by page" + page, filteredEvents));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function allEvents(req,res){
    try {
        const events = new Events();
        const {
            page = 1,
            limit = 20,
            field = 'date',
            order = 'ASC',
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        let allEvents = await events.find_with_sort({
            page: page,
            size: limit,
            order: order,
            field: field,
        });
        const filteredEvents = allEvents.rows.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date,format, theme}));
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

        let foundEvent = await event.find({id: id, company_id:company_id});
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
/** /=======================/events comments function /=======================/ */

async function createComment(req,res){
    try {
        let comment = new EventComments();
        const { event_id } = req.params;
        const {text} = req.body;
        if (text === undefined) {
            return res.json(new Response(false, "You cant creat comment without text"));
        }
        if(req.senderData.id === undefined){
            return res.json(new Response(false,"You need to authorize for this"));
        }

        const result = await comment.create(text, event_id, req.senderData.id);
        res.json(new Response(true,"Comment create" , result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editComment(req,res){
    try {
        let comment = new EventComments();
        const { events_id } = req.params;
        const {id, text} = req.body;
        const foundComment = await comment.find({ id: id, events_id:events_id });
        if(foundComment.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        if (text === undefined) {
            return res.json(new Response(false, "You cant creat comment without text"));
        }
        await comment.updateById( { id: foundComment[0].id, comment: text });
        res.json(new Response(true,"Successfully update"), foundComment[0].id);
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function deleteComment(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }

        const {id} = req.params
        const comment = new EventComments();

        let foundComment = await comment.find({id: id});
        if(foundComment.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        if(foundComment[0].user_id !== req.senderData.id) {
            return res.json(new Response(false,"It's not your comment"))
        }
        await comment.deleteRecord({ id: foundComment[0].id });
        res.json(new Response(true,"Deleted"));
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function allComments(req,res){
    try {
        const { event_id } = req.params
        const comments = new EventComments();
        const {
            page = 1,
            limit = 20,
            field = 'created_at',
            order = 'ASC',
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        let allComments = await comments.find_with_sort({
            event_id: event_id,
            page: page,
            size: limit,
            order: order,
            field: field,
        });
        res.json(new Response(true, "All events by page" + page, allComments));
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
    allEventsByCompany,
    allEvents,
    eventByID,
    //comment
    createComment,
    editComment,
    deleteComment,
    allComments,
    //location
    Location
}