const User = require('../models/users');
const Response = require("../models/response");
const UserNotification = require('../models/user_notification');
const UserTickets = require('../models/tickets_users');
const fs = require('fs');
const path = require("path");
const bcrypt = require("bcrypt");
const {NOT_FOUND_ERROR} = require("./Errors");

async function getAllUser(req, res){
    try {
        let user = new User();
        const {page,limit} = req.query;
        if(page >= 1 ) {
            const allUser = await user.find_with_sort({page: page, size: limit});
            res.json(new Response(true, "All users by page" + page, allUser));
        }else {
            res.json(new Response(false,"incorrect page, page must be more or equals than 1, but your page " + page));
        }
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
    //"Internal server error"
}

async function updateUser(req, res) {
    const { old_password, password, email, full_name } = req.body;
    const user = new User();
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const usersFound = await user.find({ id: req.senderData.id });
        if (usersFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        let updatedFields = { email, full_name };
        if (password !== undefined && old_password !== undefined) {
            if(!(await bcrypt.compare(old_password, usersFound[0].password))) {
                return res.json(new Response(false,"incorrect password"));
            }
            updatedFields.password = await bcrypt.hash(password, 10);
        }
        await user.updateById({ id: usersFound[0].id, ...updatedFields });
        return res.json(new Response(true, 'Данные пользователя успешно обновлены'));
    } catch (error) {
        console.error(error);
        return res.json(new Response(false, error.toString()));
    }
}

async function getById(req,res){
    try {
        let user = new User();
        const { user_id } = req.params;
        const cId = user_id === 'me' ? req.senderData?.id : Number.parseInt(user_id);
        if (cId === undefined)
            return res.json(new Response(false, "Not authorized"));
        const usersFoundById = await user.find({ id: cId });
        if (usersFoundById.length === 0){
            return NOT_FOUND_ERROR(res, 'User');
        }
        let filteredUser;
        if(req.senderData.id !== undefined && req.senderData.id === usersFoundById[0].id ) {
            filteredUser = usersFoundById.map(({ id, email,full_name }) => ({ id, email,full_name }));
        }else {
            filteredUser = usersFoundById.map(({ id, full_name }) => ({ id, full_name }));
        }
        res.json(new Response(true, "users by user_id", filteredUser[0]));
    } catch (error) {
        console.log(error);
        res.status(500).json(new Response(false, "Internal server error"));
    }
}

async function userAvatar(req, res) {
    const user_id = req.params.user_id;
    let user = new User();
    user.find({id: user_id})
        .then((users)=>{
            if (users.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else{
                let filename = users[0].photo
                const filePath = path.join(__dirname, '../images/avatar', filename);
                res.sendFile(filePath);
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function findByFullName(req,res) {
    try {
        let user = new User();
        const { username_part , user_ids_to_exclude } = req.body;
        const result = await user.findByFullName(user_ids_to_exclude,username_part);
        if(result !== null) {
            res.json(new Response(true," all user what found by " + username_part, result));
        } else {
            res.json(new Response(true,"not found any user by stringValue " + username_part));
        }
    } catch (error) {
        res.json(new Response(false,error.toString()));
    }
}
async function avatarUpload(req, res) {
    if (!req.file) {
        return res.json(new Response(false, 'Ошибка загрузки файла!'));
    }
    if(req.senderData.id === undefined){
        return res.json(new Response(false, "You need authorize for this action"));
    }
    const photo = req.file;
    const account_id = req.senderData.id;
    const mimetype = photo.mimetype;
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)){
        let user = new User();
        user.find({id: account_id}).then((results) => {
            let userdata = results[0];
            userdata.photo = photo.filename;
            user.updateById(userdata).then(() => {
                res.json(new Response(true, 'Фото успешно обновлено'));
            })
                .catch((error)=> {
                    res.json(new Response(false, error.toString()))
                })
        }).catch((error) => {
            console.log(error);
            res.json(new Response(false, `Не найдено аккаунта с id ${account_id}`))
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

async function getNotification(req,res){
    try {
        if(req.senderData.id === undefined) {
            return res.json(new Response(false,"Unauthorized. Please log in."))
        }
        const result = await new UserNotification().getNotification(req.senderData.id);
        if(result.length === 0) {
            return res.json(new Response(true, "You don't have any notifications."));
        }
        res.json(new Response(true,"Notifications retrieved successfully.", result));
    }catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

async function getTickets(req,res) {
    try {
        if(req.senderData.id === undefined) {
            return res.json(new Response(false,"Unauthorized. Please log in."))
        }
        const found = await new UserTickets().getAllTickets(req.senderData.id);
        if(found.length === 0) {
            return res.json(new Response(true,"You don't have a ticket to any event. "))
        }
        res.json(new Response(true,"", found));
    }catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

module.exports = {
    getAllUser,
    getById,
    avatarUpload,
    userAvatar,
    updateUser,
    findByFullName,
    getNotification,
    getTickets
}