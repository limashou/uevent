const User = require('../models/users');
const Companies = require('../models/companies');
const Response = require('../models/response')
const CompanyMember = require('../models/company_members');
const CompanyNews = require('../models/company_news');
const fs = require("fs");
const path = require("path");
const {NOT_FOUND_ERROR} = require("./Errors");
const {generateCode, transporter} = require("./Helpers");
let SendDataForMember = { }

/** /=======================/company function /=======================/ */
async function createCompanies(req, res) {
    try {
        let company = new Companies();
        const { name, email, location, description } = req.body;
        if (name === undefined || email === undefined || location === undefined) {
            return res.json(new Response(false, "Some parameters are missing"));
        }
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const result = await company.create(name, email, location, req.senderData.id, description);
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
        const result = await company.find({id: company_id});
        if (result.length === 0)
            return NOT_FOUND_ERROR(res, 'company');
        res.json(new Response(true, null, result[0]));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editCompany(req,res){
    try {
        const { name, email, location, description } = req.body;
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
        let updatedFields = { name, email, location, description };
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
            search = ''
        } = req.query;

        const filters = [];
        if (search.trim() !== '')
            filters.push(`LOWER(name) LIKE '%${search.toLowerCase()}%'`);

        if(page >= 1 ) {
            const allCompanies = await companies.find_with_sort(
                {
                    page: page,
                    size: limit,
                    order: order,
                    field: field,
                    join: 'SELECT companies.*, users.full_name as founder_name FROM companies JOIN users ON companies.founder_id = users.id',
                    filters: filters
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

async function getCompany(req, res){
    try {
        const { company_id } = req.params;
        const company = new Companies();
        const foundCompany = await company.find({ id: company_id });
        if(foundCompany.length === 0){
            return res.json(new Response(false,"Wrong id "));
        }
        res.json(new Response(true,"Company by id" + company_id, foundCompany));
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()))
    }
}

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
        const invitationCode = req.params.invitationCode;
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
        console.log('TEST');
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
        const { company_id ,member_id} = req.params;
        const { role} = req.body;
        const company = new Companies();
        const company_member = new CompanyMember();
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        if(!(await company.isFounder(req.senderData.id,company_id))) {
            return res.json(new Response(false,"it isn't your company"));
        }
        const companyMemberFound = await company_member.find({ member_id: member_id });
        if (companyMemberFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        await company.updateById({ id: companyMemberFound[0].id, role });
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
        const { company_id } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const { title, content } = req.body;
        if(!(await company_news.havePermission(company_id,req.senderData.id))) {
            return res.json(new Response(false,"you don't have permission"));
        }
        const result = await company_news.crate(company_id, title, content);
        res.json(new Response(true, "successfully create", result));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function editNews(req,res){
    try {
        const { company_id } = req.params;
        if(req.senderData.id === undefined){
            return res.json(new Response(false, "You need authorize for this action"));
        }
        const {id, title, content} = req.body;
        const company_news = new CompanyNews();
        const companyNewsFound = await company_news.find({ id: id });
        if(!(await company_news.havePermission(company_id, req.senderData.id))) {
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
        const { id } = req.params
        const company_news = new CompanyNews();
        const companyNewsFound = await company_news.find({ id: id});
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
    const {company_id ,news_id} = req.params;
    let company_news = new CompanyNews();
    company_news.find({id: news_id})
        .then((result)=>{
            if (result.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else{
                let filename = result[0].photo
                const filePath = path.join(__dirname, '../images/poster', filename);
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
    const {news_id,company_id} = req.params;
    if (!news_id){
        return res.json(new Response(false, 'Company id is empty!'));
    }
    if (!(await company_news.havePermission(company_id, req.senderData.id))) {
        return res.json(new Response(false, "deny permission "));
    }
    const filename = poster.filename.toString().toLowerCase();
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')){
        company_news.find({id: news_id}).then((results) => {
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

/** /=======================/company notification function /=======================/ */

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
    getCompany,
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
    companyNewsPosterUpload

}