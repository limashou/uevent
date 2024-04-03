const User = require('../models/users');
const Companies = require('../models/companies');
const Response = require('../models/response')
const CompanyMember = require('../models/company_members');
const CompanyNews = require('../models/company_news');
const {verify} = require("jsonwebtoken");
const {generateToken} = require("./TokenController");
const nodemailer = require("nodemailer");
const SendDataForMember = { }
/** /=======================/ nodemailer transporter /=======================/ */

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'javawebtempmail@gmail.com',
        pass: 'ljgw wsww hvod tkpz'
    }
});

/** /=======================/company function /=======================/ */
async function createCompanies(req, res) {
    try {
        let company = new Companies();
        const { name, email, location } = req.body;
        if (name === undefined || email === undefined || location === undefined) {
            return res.json(new Response(false, "Some parameters are missing"));
        }
        const result = await company.create(name, email, location, req.senderData.id);
        res.json(new Response(true, "Company created successfully", result));
    } catch (error) {
        console.error(error);
        res.json(new Response(false, error.toString()));
    }
}

async function editCompany(req,res){
    try {
        const {id,name, email, location} = req.body;
        const company = new Companies();
        if(!(await company.isFounder(req.senderData.id,id))) {
            return res.json(new Response(false,"deny permission "));
        }
        const companyFound = await company.find({ id: id });
        if (companyFound.length === 0) {
            return res.json(new Response(false, 'Пользователь не найден'));
        }
        let updatedFields = { name, email, location };
        await company.updateById({ id: companyFound[0].id, ...updatedFields });
        res.json(new Response(true, 'Данные пользователя успешно обновлены'));
    } catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}

async function deleteCompany(req,res){
    try {
        const {id} = req.params
        const company = new Companies();
        if(!(await company.isFounder(req.senderData.id,id))) {
            return res.json(new Response(false,"deny permission "));
        }
        await company.deleteRecord({id: id});
        res.json(new Response(true, "successfully delete"));
    }catch (error) {
        console.log(error);
        res.json(new Response(false,error.toString()))
    }
}
/** /=======================/company member function /=======================/ */

async function addMember(req,res){
    try {
        let user = new User();
        let company = new Companies();
        const {user_id, company_id} = req.body;
        const userFound = await user.find({id: user_id})
        if (userFound.length === 0) {
            return res.json(new Response(false, 'Not found user'));
        }
        if (!(await company.isFounder(req.senderData.id, company_id))) {
            return res.json(new Response(false, "deny permission "));
        }
        const invitationCode = generateToken({user_id, company_id}, '36h');
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
        const decodedToken = verify(req.params.token, 'secret key');
        if(req.senderData.id !== decodedToken.user_id) {
            return res.json(new Response(false,"It's not your invitation"));
        }
        let company_member  = new CompanyMember();
        company_member.create(decodedToken.company_id,decodedToken.user_id)
            .then((result) => {
                company_member.find({ id: result })
                    .then(() => {
                        res.json(new Response(true, 'User successfully add'));
                    });
            }).catch((error) => {
                res.json(new Response(false, error.toString()));
        });
    } catch (error) {
        console.log(error);
        res.json(new Response(false, error.toString()));
    }
}

async function ejectMember(req,res){
    try {
        const { member_id } = req.params;
        let company = new Companies();
        let company_member  = new CompanyMember();
        const memberFound = await company_member.find({ member_id: member_id })
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

async function changeRole(req,res){
    try {
        const {member_id, role} = req.body;
        const company = new Companies();
        const company_member = new CompanyMember();
        const companyFound = await company.find({ id: req.senderData.id });
        if(!(await company.isFounder(req.senderData.id,companyFound[0].id))) {
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
        const { company_id, title, content } = req.body;
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
        const {id, title, content} = req.body;
        const company_news = new CompanyNews();
        const companyNewsFound = await company_news.find({ id: id });
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

/** /=======================/company notification function /=======================/ */

module.exports = {
    // company
    createCompanies,
    editCompany,
    deleteCompany,
    // member
    addMember,
    acceptMember,
    changeRole,
    ejectMember,
    //  news
    createNews,
    editNews,
    deleteNews

}