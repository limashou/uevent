const User = require('../models/users');
const Companies = require('../models/companies');
const Response = require('../models/response')
const CompanyMember = require('../models/company_members');
const CompanyNews = require('../models/company_news');
const fs = require("fs");
const path = require("path");
const {NOT_FOUND_ERROR} = require("./Errors");
const {generateCode, transporter} = require("./Helpers");
const CompanyNotification = require('../models/company_notification');
const UserSubscribe = require('../models/user_subscribe');
const Notification = require('../models/notification');
const UserNotification = require('../models/user_notification');
const client = require("../db");
let SendDataForMember = { }

/** /=======================/company function /=======================/ */
async function createCompanies(req, res) {
    try {
        let company = new Companies();
        const { name, email, location,latitude,longitude, description } = req.body;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const result = await company.create(name, email, location, latitude,longitude, req.senderData.id, description);
        res.json(new Response(true, "Company created successfully", result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function getById(req, res) {
    try {
        let company = new Companies();
        const { company_id } = req.params;
        const senderDataId = req.senderData ? req.senderData.id : undefined;
        const result = await company.getCompanyAndPermissions(senderDataId, company_id);
        if (result.length === 0)
            return NOT_FOUND_ERROR(res, 'company');
        res.json(new Response(true, null, result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}
async function editCompany(req,res){
    try {
        const { name, email, location, latitude,longitude, description } = req.body;
        const { company_id } = req.params;
        const company = new Companies();
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if(!(await company.isFounder(req.senderData.id, company_id))) {
            return res.json(new Response(false,"deny permission "));
        }
        const companyFound = await company.find({ id: company_id });
        if (companyFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        let updatedFields = { name, email, location, latitude,longitude, description };
        await company.updateById({ id: companyFound[0].id, ...updatedFields });
        res.json(new Response(true, 'Данные пользователя успешно обновлены', companyFound[0].id));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function deleteCompany(req,res) {
    try {
        const {id} = req.params
        const company = new Companies();
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if (!(await company.isFounder(req.senderData.id, id))) {
            return res.json(new Response(false, "deny permission "));
        }
        await company.deleteRecord({id: id});
        res.json(new Response(true, "successfully delete"));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}

async function allCompanies(req, res) {
    try {
        const companies = new Companies();
        const {
            page = 1,
            limit = 20,
            field = 'name',
            order = 'ASC',
            search = '',
            founder_id
        } = req.query;

        const filters = [];
        if (founder_id){
            filters.push(`founder_id = ${founder_id}`)
        }
        if (search.trim() !== '')
            filters.push(`LOWER(name) LIKE '%${search.toLowerCase()}%'`);

        if(page >= 1 ) {
            const allCompanies = await companies.find_with_sort(
                {
                    page: page,
                    size: limit,
                    order: order,
                    field: field,
                    filters: filters,
                    join: 'SELECT companies.*, users.full_name AS founder_name, ' +
                        'CASE WHEN COUNT(company_members) > 0 THEN ' +
                        'json_agg(json_build_object(\'role\', company_members.role_id, \'member_id\', company_members.member_id)) ' +
                        'ELSE NULL END AS members ' +
                        'FROM companies ' +
                        'LEFT JOIN users ON companies.founder_id = users.id ' +
                        'LEFT JOIN company_members ON companies.id = company_members.company_id',
                    group: 'GROUP BY companies.id, users.full_name'
                }
            );

            res.json(new Response(true, "All companies by page " + page, allCompanies));
        }else {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}

// async function getCompany(req, res){
//     try {
//         const { company_id } = req.params;
//         const company = new Companies();
//         const foundCompany = await company.find({ id: company_id });
//         if(foundCompany.length === 0){
//             return res.json(new Response(false,"Wrong id "));
//
//         res.json(new Response(true,"Company by id" + company_id, foundCompany));
//     } catch (error) {
//         console.log(error);
//         res.json(new Response(false, error.toString()))
//     }
// }

async function companiesByFounder(req,res){
    try{
        let companies = new Companies();
        const { founder_id } = req.params;
        const allCompanies = await companies.find({ founder_id: founder_id });
        if(allCompanies.length === 0) {
            return res.json(new Response(true, "Don't have company by this founder_id"));
        }
        let filteredCompanies = allCompanies.map(({ id,name, email, location }) => ({ id,name, email, location }));
        res.json(new Response(true, "All companies by founder_id", filteredCompanies));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}

async function companyLogo(req, res) {
    const { company_id } = req.params;
    let company = new Companies();
    company.find({id: company_id})
        .then((result)=>{
            if (result.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else{
                let filename = result[0].photo
                const filePath = path.join(__dirname, '../images/logo', filename);
                res.sendFile(filePath);
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function companyLogoUpload(req, res) {
    if (!req.file) {
        return res.json(new Response(false, 'Ошибка загрузки файла!'));
    }
    let company = new Companies();
    const photo = req.file;
    const { company_id } = req.params;
    if(req.senderData.id === undefined){
        return res.json(new Response(false, "You need authorize for this action"));
    }
    if (!company_id){
        return res.json(new Response(false, 'Company id is empty!'));
    }
    if (!(await company.isFounder(req.senderData.id, company_id))) {
        return res.json(new Response(false, "deny permission "));
    }
    const filename = photo.filename.toString().toLowerCase();
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')){
        company.find({id: company_id}).then((results) => {
            let companyData = results[0];
            companyData.photo = photo.filename;
            console.log(companyData);
            company.updateById(companyData).then(() => {
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

async function searchByCompanyName(req,res) {
    try {
        const { name_part } = req.body;
        let company = new Companies();
        const result = await company.findByName(name_part);
        if(result !== null) {
            res.json(new Response(true," all company what found by " + name_part, result));
        } else {
            res.json(new Response(true,"not found any company by name_part " + name_part));
        }
    }catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()));
    }
}

/** /=======================/company member function /=======================/ */
async function addMember(req,res){
    try {
        let user = new User();
        let company = new Companies();
        const { company_id } = req.params;
        const {user_id} = req.body;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const userFound = await user.find({id: user_id})
        if (userFound.length === 0) {
            return res.json(new Response(false, 'Not found user'));
        }
        if (!(await company.isFounder(req.senderData.id, company_id))) {
            return res.json(new Response(false, "deny permission "));
        }

        const invitationCode = generateCode();
        SendDataForMember[invitationCode] = { user_id, company_id };

        const companyFound = await company.find({id: company_id});
        if (companyFound.length !== 0) {
            const mailOptions = {
                to: userFound[0].email,
                subject: 'Invite',
                text: `${companyFound[0].name} invites you to join his company. Click the link to accept:  ${req.headers.origin}/accept-invitation/${invitationCode}`
            };
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.json(false, "Can't send invitation" + error.message)
                } else {
                    console.log('Email sent: ', info);
                    res.json(new Response(true, "Send invitation"));
                }
            });
        } else {
            res.json(new Response(false, "Not found company"));
        }
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

async function acceptMember(req,res) {
    try {
        const { invitationCode } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if (!SendDataForMember[invitationCode]) {
            return res.json(new Response(false,"Invalid invitation code"));
        }
        if (req.senderData.id !== SendDataForMember[invitationCode].user_id) {
            return res.json(new Response(false,"It's not your invitation"));
        }
        let company_member = new CompanyMember();
        const result = await company_member.create(SendDataForMember[invitationCode].company_id, SendDataForMember[invitationCode].user_id);
        delete SendDataForMember[invitationCode];
        res.json(new Response(true, 'User successfully add', result));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}


async function ejectMember(req,res){
    try {
        const { company_id,member_id } = req.params;
        let company = new Companies();
        let company_member  = new CompanyMember();
        const memberFound = await company_member.find({ member_id: member_id, company_id: company_id })
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if (memberFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        if(!(await company.isFounder(req.senderData.id,memberFound[0].company_id))) {
            return res.json(new Response(false,"deny permission "));
        }
        await company_member.deleteRecord({ id: memberFound[0].id });
        res.json(new Response(true, 'Successfully delete member'));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

async function allCompanyMember(req,res){
    try {
        const { company_id } = req.params;
        const company_member = new CompanyMember();
        const allMember = await company_member.getAllCompanyUsers( company_id );
        if(allMember.length === 0) {
            return res.json( new Response(false,"Wrong company id"));
        }
        res.json(new Response(true, "all member", allMember));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

async function changeRole(req,res){
    try {
        const { company_id, member_id} = req.params;
        const { role } = req.body;
        const company = new Companies();
        const company_member = new CompanyMember();
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if(!(await company.isFounder(req.senderData.id, company_id))) {
            return res.json(new Response(false,"it isn't your company"));
        }
        const companyMemberFound = await company_member.find({company_id: company_id, member_id: member_id });
        if (companyMemberFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        await company_member.updateById({ id: companyMemberFound[0].id, role_id: role });
        res.json(new Response(true, 'Данные пользователя успешно обновлены'));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

/** /=======================/company news function /=======================/ */
async function createNews(req,res){
    try {
        let company_news = new CompanyNews();
        let notification = new Notification();
        const { company_id } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const { title, content } = req.body;
        if(!(await company_news.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false,"you don't have permission"));
        }
        const newsSubscription = await notification.isNews(company_id);
        const result = await company_news.crate(company_id, title, content);
        if (newsSubscription) {
            const newNotification = await notification.notification("The " + newsSubscription.name + " has some new news",
                "There is a new news item on the company page titled: " + title + ".",
                "/api/companies/" + company_id + "/news/" + result)
            for (const newsSubscriptionElement of newsSubscription) {
                await new UserNotification().notification(newsSubscriptionElement.id,newNotification);
            }
        }
        res.json(new Response(true, "successfully create", result));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function editNews(req,res){
    try {
        const { news_id } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const  { title, content} = req.body;
        const company_news = new CompanyNews();
        const companyNewsFound = await company_news.find({ id: news_id });
        if(!(await company_news.havePermission(companyNewsFound[0].company_id, req.senderData.id))) {
            return res.json(new Response(false,"deny permission "));
        }
        if (companyNewsFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        let updatedFields = { title, content };
        await companyNewsFound.updateById({ id: companyNewsFound[0].id, ...updatedFields });
        res.json(new Response(true, 'Данные пользователя успешно обновлены'));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function deleteNews(req,res){
    try {
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const { news_id } = req.params
        const company_news = new CompanyNews();
        const companyNewsFound = await company_news.find({ id: news_id});
        if(!(await company_news.havePermission(companyNewsFound[0].company_id, req.senderData.id))) {
            return res.json(new Response(false,"deny permission "));
        }
        if (companyNewsFound.length === 0) {
            return res.json(new Response(false, 'News not found'));
        }
        await company_news.deleteRecord({id: companyNewsFound[0].id});
        res.json(new Response(true, "successfully delete"));
    }catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function companyNewsPoster(req, res) {
    const {news_id} = req.params;
    let company_news = new CompanyNews();
    company_news.find({id: news_id})
        .then((result)=>{
            if (result.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else{
                let filename = result[0].poster
                const filePath = path.join(__dirname, '../images/poster/news', filename);
                res.sendFile(filePath);
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function companyNewsPosterUpload(req, res) {
    if (!req.file) {
        return res.json(new Response(false, 'Ошибка загрузки файла!'));
    }
    if(req.senderData.id === undefined){
        return res.json(new Response(false, "You need authorize for this action"));
    }
    let company_news = new CompanyNews();
    const poster = req.file;
    const {news_id} = req.params;
    if (!news_id){
        return res.json(new Response(false, 'news id is empty!'));
    }
    const filename = poster.filename.toString().toLowerCase();
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')){
        company_news.find({id: news_id}).then((results) => {
            if (!(company_news.havePermission(results[0].company_id, req.senderData.id))) {
                return res.json(new Response(false, "deny permission "));
            }
            let companyData = results[0];
            companyData.poster = poster.filename;
            console.log(companyData);
            company_news.updateById(companyData).then(() => {
                res.json(new Response(true, 'Фото успешно обновлено'));
            })
                .catch((error)=> {
                    res.json(new Response(false, error.toString()))
                })
        }).catch((error) => {
            console.log(error);
            res.json(new Response(false, `Not found news with id ${news_id}`))
        })
    }
    else {
        res.json(new Response(false, 'Данный тип изображения не поддерживается'));
        fs.unlink(poster.path, (err) => {
            if (err) {
                console.error(`Ошибка при удалении файла: ${err}`);
            }
        });
    }
}

async function getNewsById(req,res){
    try {
        const { news_id } = req.params;
        const news = new CompanyNews();
        const newsFound = await news.find({id: news_id});
        if(newsFound.length === 0) {
            return NOT_FOUND_ERROR(res, 'news');
        }
        res.json(new Response(true,"News by id" + news_id, newsFound));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()));
    }
}

async function allCompanyNews(req, res) {
    try {
        const { company_id } = req.params;
        const news = new CompanyNews();
        const {
            page = 1,
            limit = 20,
            field = 'title',
            order = 'ASC',
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        const companyNews = await news.find_with_sort({
            company_id: company_id,
            page: page,
            size: limit,
            order: order,
            field: field,
        });
        if(companyNews.length === 0) {
            return res.json(new Response(true,"You haven't received any notifications"));
        }
        res.json(new Response(true, "all notification", companyNews));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}

async function allNews(req, res) {
    try {
        const news = new CompanyNews();
        const {
            page = 1,
            limit = 20,
            field = 'name',
            order = 'ASC',
        } = req.query;

        if(page < 1 ) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        const companyNews = await news.find_with_sort({
            page: page,
            size: limit,
            order: order,
            field: field,
        });
        if(companyNews.length === 0) {
            return res.json(new Response(true,"You haven't received any notifications"));
        }
        res.json(new Response(true, "all notification", companyNews));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}
/** /=======================/company notification function /=======================/ */

async function getNotification(req, res) {
    try {
        const { company_id } = req.params;
        const { page = 1, limit = 20, field = 'date', order = 'DESC' } = req.query;
        if (req.senderData.id === undefined) {
            return res.json(new Response(false, "Unauthorized. Please log in."));
        }
        if (page < 1) {
            return res.json(new Response(false, `Incorrect page. Page must be greater than or equal to 1, but your page is ${page}`));
        }
        const companyNotification = new CompanyNotification();
        if (!(await companyNotification.isMember(company_id, req.senderData.id))) {
            return res.json(new Response(false, "You're not a member of the company."));
        }
        const companyNotifications = await companyNotification.find_with_sort({
            company_id,
            page,
            size: limit,
            order,
            field,
        });
        if (!companyNotifications.rows || companyNotifications.rows.length === 0) {
            return res.status(200).json(new Response(true, "No notifications found for this company."));
        }
        const lastReadNotificationId = companyNotifications.rows[0].id;
        await client.query(
            'UPDATE companies SET last_read_notification = $1 WHERE id = $2',
            [lastReadNotificationId, company_id]
        );
        return res.json(new Response(true,
            "Company notifications retrieved and last read notification updated successfully.", companyNotifications));

    } catch (error) {
        console.error("Error in getCompanyNotification:", error);
        return res.json(new Response(false, "An error occurred while retrieving company notifications."));
    }
}
async function deleteNotification(req,res){
    try {
        const { company_id, notification_id } = req.params;
        if(req.senderData.id === undefined) {
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const notification = new CompanyNotification();
        if(!(await notification.isMember(company_id,req.senderData.id))){
            return res.json(new Response(false, "You not member of the company"));
        }
        const notificationForDelete = await notification.find({ id: notification_id });
        if(notificationForDelete.length === null) {
            return res.json(new Response(false, "Wrong notification id"));
        }
        await notification.deleteRecord({id: notificationForDelete[0].id});
        res.json(new Response(true, "Deleted"));
    }catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}
/** /=======================/ user subscribe /=======================/ */

async function userSubscribe(req,res){
    try {
        const { company_id } = req.params;
        const { update_events, new_news, new_events } = req.body;
        if(req.senderData.id === undefined) {
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const result  = await new UserSubscribe().subscribe(req.senderData.id, company_id, update_events, new_news, new_events);
        res.json(new Response(true,"You successfully subscribe", result));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function userChangeSubscribe(req, res) {
    try {
        if (req.senderData.id === undefined) {
            return res.json(new Response(false, "You need to authorize for this action"));
        }
        const { company_id } = req.params;
        const { update_events, new_news, new_events } = req.body;
        const subscribe = new UserSubscribe();
        const foundSubscribe = await userSubscribe.find({ company_id: company_id, user_id: req.senderData.id });
        if (foundSubscribe.length === 0) {
            return res.json(new Response(false, "Wrong subscribe_id"));
        }
        if (foundSubscribe[0].user_id !== req.senderData.id) {
            return res.json(new Response(false, "It's not your subscribe"));
        }
        let updatedFields = { update_events, new_news, new_events  };
        await subscribe.updateById({ id: foundSubscribe[0].id, ...updatedFields });
        res.json(new Response(true, 'Subscribe successfully update', foundSubscribe[0].id));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function userUnsubscribe(req, res) {
    try {
        if (req.senderData.id === undefined) {
            return res.json(new Response(false, "You need to authorize for this action"));
        }
        const { company_id } = req.params;
        const userSubscribe = new UserSubscribe();
        const foundSubscribe = await userSubscribe.find({ company_id: company_id, user_id: req.senderData.id });
        if (foundSubscribe.length === 0) {
            return res.json(new Response(false, "Wrong subscribe_id"));
        }
        if (foundSubscribe[0].user_id !== req.senderData.id) {
            return res.json(new Response(false, "It's not your subscribe"));
        }
        await userSubscribe.deleteRecord({ id: foundSubscribe[0].id });
        res.json(new Response(true, "Unsubscribed successfully"));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

/** /=======================/ module exports /=======================/ */

async function filtersByCompany(req,res){
    try {
        const companyName = await new Companies().companyName();
        if(companyName.length === 0) {
            return res.json(new Response(false, ""));
        }
        res.json(new Response(true,"", companyName));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function filtersByFounder(req,res){
    try {
        const founderName = await new Companies().founderName();
        if(founderName.length === 0) {
            return res.json(new Response(false, ""));
        }
        res.json(new Response(true,"", founderName));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

/** /=======================/ module exports /=======================/ */

module.exports = {
    // company
    createCompanies,
    getById,
    editCompany,
    deleteCompany,
    allCompanies,
    companiesByFounder,
    companyLogoUpload,
    companyLogo,
    // getCompany,
    searchByCompanyName,
    // member
    addMember,
    acceptMember,
    changeRole,
    ejectMember,
    allCompanyMember,
    //  news
    createNews,
    editNews,
    deleteNews,
    companyNewsPoster,
    companyNewsPosterUpload,
    getNewsById,
    allNews,
    allCompanyNews,
    //notification
    getNotification,
    deleteNotification,
    //user
    userSubscribe,
    userUnsubscribe,
    userChangeSubscribe,
    //filters
    filtersByCompany,
    filtersByFounder
}