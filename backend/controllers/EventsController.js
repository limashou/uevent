const Events = require('../models/events');
const EventComments = require('../models/event_comments');
const Response = require("../models/response");
const Notification = require('../models/notification');
const UserNotification = require('../models/user_notification');
const Promo_code = require('../models/promo_codes');
const path = require("path");
const fs = require("fs");
const {generateCode} = require("./Helpers");


/** /=======================/events function /=======================/ */

async function createEvent(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        let event = new Events();
        const { company_id } = req.params;
        const {name, notification, description, location, latitude, longitude, date, format, theme} = req.body;
        if(!(await event.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const result = await event.create(name, notification, description, location, latitude, longitude ,date, format, theme ,company_id);
        let bdNotification = new Notification();
        const eventsSubscription = await bdNotification.isNewEvents(company_id);
        if (eventsSubscription) {
            const newNotification = await bdNotification.notification("The " + eventsSubscription[0].name + " has some new events",
                "The " + eventsSubscription[0].name + " has created a new event: " + name + ".",
                "/api/events/" + company_id + "/byId/" + result)
            for (const eventsSubscriptionElement of eventsSubscription) {
                await new UserNotification().notification(eventsSubscriptionElement.user_subscribe_id, newNotification)
            }
        }
        res.json(new Response(true,"Event create" , result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editEvent(req,res){
    try {
        let event = new Events();
        const { event_id } = req.params;
        const { name, notification, description, location, latitude, longitude ,date, format, theme} = req.body;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const foundEvent = await event.find({ id: event_id });
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }

        if(!(await event.havePermission(foundEvent[0].company_id,req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }

        let updatedFields = { name, notification, description, location, latitude, longitude ,date, format, theme };
        await event.updateById( { id: foundEvent[0].id, ...updatedFields });
        let bdNotification = new Notification();
        const editSubscription = await bdNotification.isUpdateEvents(foundEvent[0].company_id);
        if (editSubscription) {
            const newNotification = await bdNotification.notification(
                "The " + editSubscription[0].name + " complemented the event.",
                "The " + editSubscription[0].name + " has complemented the event: " + name + ".",
                "/api/events/" + foundEvent[0].company_id + "/byId/" + foundEvent[0].id)
            for (const editSubscriptionElement of editSubscription) {
                await new UserNotification().notification(editSubscriptionElement.user_subscribe_id, newNotification)
            }
        }
        res.json(new Response(true,"Successfully update",foundEvent[0].id));
    }catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function deleteEvent(req,res){
    try {
        const { event_id } = req.params
        const event = new Events();
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }

        let foundEvent = await event.find({id: event_id});
        if(foundEvent.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }

        if(!(await event.havePermission(foundEvent[0].company_id, req.senderData.id))) {
            return res.json(new Response(false, "Not enough permission"));
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
        allEvents.rows = allEvents.rows.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date, format, theme}));
        res.json(new Response(true, null, allEvents));
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
            search = '',
            dateFrom,
            dateTo,
            formats = [],
            themes = [],
            company_id
        } = req.query;

        const filters = [];
        if (search.trim() !== '')
            filters.push(`LOWER(name) LIKE '%${search.toLowerCase()}%'`);
        if (new Date(dateFrom).toString() !== 'Invalid Date') {
            const dateFromString = new Date(dateFrom).toISOString();
            filters.push(`date > '${dateFromString}'`);
        }

        if (new Date(dateTo).toString() !== 'Invalid Date') {
            const dateToString = new Date(dateTo).toISOString();
            filters.push(`date < '${dateToString}'`);
        }

        if (formats.length > 0){
            filters.push(`format in ('${formats.join('\',\'')}')`);
        }
        if (themes.length > 0){
            filters.push(`theme in ('${themes.join('\',\'')}')`);
        }
        if (company_id){
            filters.push(`company_id = ${company_id}`);
        }

        if(page < 1) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        let allEvents = await events.find_with_sort({
            page: page,
            size: limit,
            order: order,
            filters: filters,
            field: field,
        });
        allEvents.rows = allEvents.rows.map(({ id, name, description, date, format, theme}) => ({ id, name, description, date,format, theme}));
        res.json(new Response(true, null, allEvents));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function eventByID(req,res){
    try {
        const { event_id } = req.params
        const event = new Events()
        const senderDataId = req.senderData ? req.senderData.id : undefined;
        let foundEvent = await event.getEvent(event_id,senderDataId);
        // if(foundEvent.length === 0){
        //     return res.json(new Response(false,"Wrong id "));
        // }
        res.json(new Response(true,"Event by id " + event_id + " user_id "+ senderDataId, foundEvent));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function eventPoster(req, res) {
    const { event_id } = req.params;
    new Events().find({id: event_id})
        .then((result)=>{
            if (result.length === 0){
                res.json(new Response(false, 'Event with this id not found!'))
            }
            else{
                let filename = result[0].poster
                const filePath = path.join(__dirname, '../images/poster/events', filename);
                res.sendFile(filePath);
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function eventPosterUpload(req, res) {
    if (!req.file) {
        return res.json(new Response(false, 'Ошибка загрузки файла!'));
    }
    let events = new Events();
    const photo = req.file;
    const { event_id } = req.params;
    if(req.senderData.id === undefined){
        return res.json(new Response(false, "You need authorize for this action"));
    }
    if (!event_id){
        return res.json(new Response(false, 'Company id is empty!'));
    }
    const filename = photo.filename.toString().toLowerCase();
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')){
        events.find({id: event_id}).then((results) => {
            let eventData = results[0];
            if (!(events.havePermission(results[0].company_id,req.senderData.id))) {
                return res.json(new Response(false, "deny permission "));
            }
            eventData.poster = photo.filename;
            console.log(eventData);
            events.updateById(eventData).then(() => {
                res.json(new Response(true, 'Фото успешно обновлено'));
            })
                .catch((error)=> {
                    res.json(new Response(false, error.toString()))
                })
        }).catch((error) => {
            console.log(error);
            res.json(new Response(false, `Not found company with id ${company_id}`))
        })
    }
    else {
        res.json(new Response(false, 'Данный тип изображения не поддерживается'));
        fs.unlink(photo.path, (err) => {
            if (err) {
                console.error(`Ошибка при удалении файла: ${err}`);
            }
        });
    }
}

/** /=======================/events comments function /=======================/ */

async function createComment(req,res){
    try {
        let comment = new EventComments();
        const { event_id } = req.params;
        const {text} = req.body;
        if (text === undefined) {
            return res.json(new Response(false, "You cant create comment without text"));
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
        const { comment_id } = req.params;
        const { text } = req.body;
        const foundComment = await comment.find({ id: comment_id });
        if(foundComment.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        if (text === undefined) {
            return res.json(new Response(false, "You cant creat comment without text"));
        }
        await comment.updateById( { id: foundComment[0].id, comment: text });
        res.json(new Response(true,"Successfully update", foundComment[0].id));
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

        const {comment_id} = req.params
        const comment = new EventComments();

        let foundComment = await comment.find({id: comment_id});
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
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        let allComments = await comments.find_with_sort({
            event_id: event_id,
            page: page,
            size: limit,
            order: 'ASC',
            field: 'created_at',
        });
        res.json(new Response(true, "All events by page" + page, allComments));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

/** /=======================/events comments function /=======================/ */

async function generatePromoCode(req,res){
    try {
        const { event_id } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if(!(await new Events().havePermission((await new Events().find({id: event_id}))[0].company_id, req.senderData.id))) {
            return res.json(new Response(false,"Not enough permission"));
        }
        const { discount, discount_type, valid_to } = req.body;
        const newPromoCode = await new Promo_code().code(generateCode(),discount, discount_type, event_id, valid_to);
        let bdNotification = new Notification();
        const codeSubscription = await bdNotification.isUpdateEvents((await new Events().find({id: event_id}))[0].company_id);
        if (codeSubscription) {
            const newNotification = await bdNotification.notification(
                "Promo code",
                "The " + codeSubscription[0].name + " give you new promo code for event " + (await new Events().find({id:event_id}))[0].name + ": " + (await new Promo_code().find({id: newPromoCode}))[0].code +  ".",
                "")
            for (const editSubscriptionElement of codeSubscription) {
                await new UserNotification().notification(editSubscriptionElement.user_subscribe_id, newNotification)
            }
        }
        res.json(new Response(true,"New promo code", newPromoCode));
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
    eventPoster,
    eventPosterUpload,
    //comment
    createComment,
    editComment,
    deleteComment,
    allComments,
    //promo code
    generatePromoCode
}