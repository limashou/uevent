const User = require('../models/users');
const Response = require('../models/response');
const token_controller = require('../controllers/TokenController');
const {generateCode, transporter} = require("./Helpers");
const ERRORS = require('./Errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let SendDataForMember = { }

async function register(req, res) {
    const { username, password, email, full_name } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.json(new Response(false, 'Ошибка хэширования пароля'));
            return;
        }
        console.log('Хэш пароля:', hash);
        let user = new User();
        user.registration(username, hash, email, full_name)
            .then((result) => {
                user.find({ id: result })
                    .then(() => {
                        const mailOptions = {
                            to: email,
                            subject: 'Registration',
                            text: `You have successfully logged on uevent`
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error(error);
                                // res.json(false, "Can't send invitation" + error.message)
                            } else {
                                console.log('Email sent: ', info);
                                // res.json(new Response(true, "Send invitation"));
                            }
                        });
                        res.json(new Response(true, 'Регистрация успешна'));
                    })
            }).catch((error) => {
            console.log(error);
            res.json(new Response(false, error.toString()));
        });
    });
}

async function login(req, res) {
    const {username, password} = req.body;
    new User().find({username: username})
        .then(async (usersFound) => {
            if (usersFound.length === 0) {
                res.json(new Response(false, 'Нет пользователя с такими данными'));
            } else {
                try {
                    if (await bcrypt.compare(password, usersFound[0].password)) {
                        res.cookie('auth_token', token_controller.generateToken({ id: usersFound[0].id }), { httpOnly: true, session: true });
                        res.json(new Response(true, 'Успешный вход', { user_id: usersFound[0].id }));
                    } else {
                        res.json(new Response(false, 'Incorrect password!'));
                    }
                } catch (error) {
                    console.error(error);
                    res.json(new Response(false, error.toString()));
                }
            }
        })
        .catch((error) => {
            console.error(error);
            res.json(new Response(false, error.toString()));
        });
}


async function password_reset(req, res) {
    const { email } = req.body;
    let user = new User();
    let find_results = await user.find({email: email});
    if (find_results.length === 0)
        return ERRORS.NOT_FOUND_ERROR(res, 'User');
    const invitationCode = generateCode();
    SendDataForMember[invitationCode] = { username: find_results[0].username };
    // const token = token_controller.generateToken({username: find_results[0].username}, '10m');

    const link = `${req.headers.origin}/auth/password-reset/${invitationCode}`;
    const mailOptions = {
        to: find_results[0].email,
        subject: 'Password reset',
        html: `<p>Dear ${find_results[0].full_name}.</p>
<p>Your password recovery <a style="font-weight: bold" href="${link}">link</a></p>
<p style="color: red">You have 10 minutes to use it!</p>
<p>If you didn't do this, please ignore this message.</p>`
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json(new Response(false, error.toString()));
        } else {
            res.json(new Response(true, 'Посилання на відновлення паролю було відправлено на вашу пошту'));
        }
    });
}

async function password_reset_confirmation(req, res) {
    try {
        const { invitationCode } = req.params;
        let user = new User();
        const results = await user.find({username: SendDataForMember[invitationCode].username});
        if (results.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'user');
        bcrypt.hash(req.body.password,saltRounds, (err,hash) => {
            if (err) {
                console.error(err);
                res.json(new Response(false, 'Ошибка хэширования пароля'));
                return;
            }
            user.updateById({
                id: results[0].id,
                password: hash
            });
            delete SendDataForMember[invitationCode];
            res.json(new Response(true, 'Данные оновлены'));
        });
    } catch (error){
        res.json(new Response(false, error.toString()));
    }
}

module.exports = {
    register,
    login,
    password_reset,
    password_reset_confirmation
}