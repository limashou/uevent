const Tickets = require('../models/tickets');
const Response = require("../models/response");
const Events = require("../models/events");
const TicketsUsers = require('../models/tickets_users');
const {transporter} = require("./Helpers");
const pdfkit = require('pdfkit');
const User  = require('../models/users');
const QRCode = require('qrcode');
const { PassThrough } = require('stream');
const CompanyNotification = require('../models/company_notification');
/** /=======================/tickets function /=======================/ */

async function creteTickets(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const tickets = new Tickets();
        const event = new Events();
        const { event_id } = req.params;
        const { ticket_type,price, available_tickets } = req.body;
        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const eventFound = await event.find({id: event_id});
        if(eventFound.length === 0) {
            return res.json(new Response(false,"Wrong event id"));
        }
        if(!(await event.havePermission(eventFound[0].company_id, req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const result = await tickets.createTickets(ticket_type, price, available_tickets, 'available', eventFound[0].id);
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
        const { ticket_id } = req.params;
        const { ticket_type, price, available_tickets } = req.body;
        const ticketsFound = await tickets.find({id: ticket_id});

        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const eventFound = await event.find({id: ticketsFound[0].event_id});
        if(eventFound.length === 0) {
            res.json(new Response(false,"Wrong event id"));
        }
        if(!(await event.havePermission(eventFound[0].company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
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
        const { ticket_id } = req.params
        const event = new Events();
        const tickets = new Tickets();
        let foundTickets = await tickets.find({id: ticket_id});
        let foundEvent = await event.find({id: foundTickets[0].event_id});
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong event id "));
        }
        if(!(await event.havePermission(foundEvent[0].company_id,req.senderData.id))) {
            return res.json(new Response(false, "Not enough permission"));
        }
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

async function getTicketsByEvent(req,res) {
    try {
        const { event_id } = req.params;
        const tickets = new Tickets();
        const ticketsFound = await tickets.find({event_id: event_id});
        if(ticketsFound.length === null) {
            return res.json(new Response(true, "Not found tickets"));
        }
        res.json(new Response(true,"All tickets by event_id" + event_id, ticketsFound));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

/** /=======================/tickets_users function /=======================/ */
//отправка билета при успешной проверке
async function generateTicketPdf(user_id, ticket_id, ticket_status) {
    try {
        let user = new User();
        let ticket = new Tickets();
        let event = new Events();
        const ticketFound = await ticket.find({ id: ticket_id });
        const userFound = await user.find({ id: user_id });
        const eventFound = await event.find({ id: ticketFound[0].event_id });
        const doc = new pdfkit();

        const qrData = `https://example.com/ticket/${ticket_id}`;
        const qrCodeBuffer = await QRCode.toBuffer(qrData, { errorCorrectionLevel: 'H' });

        doc.image(qrCodeBuffer, 150, 250, { width: 100, height: 100 });
        const ticketTypeText = `Ticket type: ${ticket_status}`;
        doc.text(ticketTypeText, { encoding: 'utf-8' });
        doc.text('Your ticket to the event');
        if (eventFound.length > 0) {
            doc.text(`Event: ${eventFound[0].name || 'Name not specified'}`);
            doc.text(`Format: ${eventFound[0].format || 'Format not specified'}`);
            doc.text(`Theme: ${eventFound[0].theme || 'Theme not specified'}`);
            doc.text(`Date: ${eventFound[0].date || 'Date not specified'}`);
            if (eventFound.length > 0 && eventFound[0].description) {
                doc.text('Description:');
                doc.text(eventFound[0].description);
            } else {
                doc.text('Description not available');
            }
            // doc.text(`Location: ${eventFound[0].location}`);
        } else {
            doc.text('Event not found');
        }

        doc.text(`Ticket price: ${ticketFound[0].price}`);
        doc.text(`Ticket type: ${ticketFound[0].ticket_type}`);

        const pdfStream = doc.pipe(new PassThrough());
        const mailOptions = {
            to:  userFound[0].email,
            subject: 'Your ticket',
            text: 'Here is your ticket to the event.',
            attachments: [
                {
                    filename: 'ticket.pdf',
                    content: pdfStream
                }
            ]
        };

        doc.end();

        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error(error);
    }
}


async function buyTicket(req,res){
    try {
        if(Object.keys(req.body).length === 0) {
            return res.json(new Response(false, "Empty body"));
        }
        const { ticket_id } = req.params;
        const { ticket_status ,show_username } = req.body;
        const ticketUser = new TicketsUsers();
        if(req.senderData.id === undefined) {
            return res.json(new Response(false,"You need to authorize for buy or reserved ticket"))
        }
        if(await ticketUser.DATAUS(ticket_id)){
            return res.json(new Response(false, "All tickets are sold out"));
        }
        if(await ticketUser.isNotificationEnabled(ticket_id)) {
            const currentTime = new Date();
            let notification = new CompanyNotification();
            const information = await ticketUser.getInformation(ticket_id, req.senderData.id);
            await notification.create("Event ticket purchase " + information[0].name,
                "The " + information[0].full_name + " " + ticket_status +" a " + information[0].ticket_type + " ticket to the event",
                information[0].company_id, currentTime);
        }
        const result = await ticketUser.buy(ticket_status,req.senderData.id,ticket_id,show_username);
        await generateTicketPdf(req.senderData.id,ticket_id,ticket_status);
        res.json(new Response(true, "Ticket " + ticket_status +" successfully",result));
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function cancelTicket(req,res){
    try {
        const { ticket_id} = req.params;
        if(req.senderData.id === undefined) {
            return res.json(new Response(false,"You need to authorize for buy or reserved ticket"))
        }
        let ticket_user = new TicketsUsers();
        const found = await ticket_user.find({ ticket_id: ticket_id, user_id: req.senderData.id })
        if(req.senderData.id === found[0].user_id) {
            return res.json(new Response(false,"It's not your ticket"))
        }
        await ticket_user.rollbackAvailableTickets(ticket_id);
        await ticket_user.deleteRecord({ id: found[0].id });
        return res.json(new Response(true,"You successfully canceled ticket"))
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function getUsers(req, res){
    try {
        const { event_id } = req.params;
        let ticket_user = new TicketsUsers();
        const result = await ticket_user.getUserByEventId(event_id);
        if(result.length === 0){
            res.json(new Response(false,"Empty result"));
        }
        res.json(new Response(false, "visitors",result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function informationByTicket(req,res){
    try {
        const {id} = req.params;
        const ticket_user = new TicketsUsers();
        const found  = await ticket_user.getInformationById(id);
        if (found.length === null) {
            res.json(new Response(false,"empty find"));
        }
        return res.json(new Response(true,"Information",found[0]));

    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

module.exports = {
    creteTickets,
    editTickets,
    removeTickets,
    getTicketsByEvent,
    buyTicket,
    cancelTicket,
    informationByTicket,
    getUsers
}