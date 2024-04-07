const Tickets = require('../models/tickets');
const Event = require('../models/events');
const Response = require("../models/response");
const Events = require("../models/events");
const TicketsUsers = require('../models/tickets_users');

/** /=======================/tickets function /=======================/ */

async function creteTickets(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const tickets = new Tickets();
        const event = new Event();
        const { event_id } = req.params;
        const { ticket_type,price, available_tickets } = req.body;
        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const eventFound = await event.find({id: event_id});
        if(eventFound.length === 0) {
            res.json(new Response(false,"Wrong event id"));
        }
        if(!(await tickets.havePermission(eventFound[0].company_id, req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const result = await tickets.createTickets(eventFound[0].id,ticket_type,price,available_tickets);
        res.json(new Response(true, "Tickets created",result));

    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editTickets(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        let tickets = new Tickets();
        let event = new Events();
        const { event_id } = req.params;
        const { id, ticket_type, price, available_tickets } = req.body;
        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const eventFound = await event.find({id: event_id});
        if(eventFound.length === 0) {
            res.json(new Response(false,"Wrong event id"));
        }
        if(!(await event.havePermission(eventFound[0].company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const ticketsFound = await tickets.find({id: id});
        if(ticketsFound.length === 0) {
            res.json(new Response(false,"Wrong tickets id"));
        }
        let updatedFields = { ticket_type, price, available_tickets };
        await tickets.updateById( { id: ticketsFound[0].id, ...updatedFields });
        res.json(new Response(true,"Successfully update"),ticketsFound[0].id);
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function removeTickets(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const {event_id, id} = req.params
        const event = new Events();
        const tickets = new Tickets();
        let foundEvent = await event.find({id: event_id});
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong event id "));
        }
        if(!(await tickets.havePermission(foundEvent[0].company_id,req.senderData.id))) {
            return res.json(new Response(false, "Not enough permission"));
        }
        let foundTickets = await tickets.find({id: id});
        if(foundTickets.length === 0){
            return res.json(new Response(false,"Wrong event id "));
        }
        await tickets.deleteRecord({ id: foundTickets[0].id });
        res.json(new Response(true,"Deleted"));
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

/** /=======================/tickets_users function /=======================/ */
//отправка билета при успешной проверке
async function buyTicket(req,res){
    try {
        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const { ticket_status, ticket_id ,show_username } = req.body;
        const ticketUser = new TicketsUsers();
        if(req.senderData.id === undefined) {
            return res.json(new Response(false,"You need to authorize for buy or reserved ticket"))
        }
        await ticketUser.DATAUS(ticket_id);
        const result = await ticketUser.buy(ticket_status,req.senderData.id,ticket_id,show_username);
        if(ticket_status === "buy") {
            res.json(new Response(true, "Ticket purchased successfully",result));
        } else {
            res.json(new Response(true, "Ticket reserved successfully",result));
        }
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

module.exports = {
    creteTickets,
    editTickets,
    removeTickets,
    buyTicket,
}