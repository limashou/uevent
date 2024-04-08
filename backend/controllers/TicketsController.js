const Tickets = require('../models/tickets');
const Response = require("../models/response");
const Events = require("../models/events");
const TicketsUsers = require('../models/tickets_users');
const {transporter} = require("./Helpers");
const pdfkit = require('pdfkit');
const User  = require('../models/users');
const QRCode = require('qrcode');
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
async function generateTicketPdf(user_id,ticket_id,ticket_status) {
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
        doc.text(`Тип билета ${ticket_status}`)
        doc.text('Ваш билет на мероприятие');
        doc.text(`Мероприятие: ${eventFound[0].name}`);
        doc.text(`Формат: ${eventFound[0].format}`);
        doc.text(`Тема: ${eventFound[0].theme}`);
        doc.text(`Дата: ${eventFound[0].date}`);
        // doc.text(`Место: ${eventFound[0].location}`);

// Добавляем описание мероприятия
        doc.text('Описание:');
        doc.text(eventFound[0].description);

// Добавляем информацию о билете
        doc.text(`Цена билета: ${ticketFound[0].price}`);
        doc.text(`Тип билета: ${ticketFound[0].ticket_type}`);

// Создаем поток для PDF
        const pdfStream = doc.pipe(require('stream').PassThrough());

        const mailOptions = {
            to:  userFound[0].email,
            subject: 'Ваш билет',
            text: 'Пожалуйста, вот ваш билет на мероприятие.',
            attachments: [
                {
                    filename: 'ticket.pdf',
                    content: pdfStream
                }
            ]
        };

        doc.end();

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}
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
        await generateTicketPdf(req.senderData.id,ticket_id,ticket_status);
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