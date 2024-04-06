const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storageUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/avatar');
    },
    filename: (req, file, cb) => {
        const account_id = req.senderData.id;

        if (account_id) {
            const newFilename = `user_avatar_${account_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});
const storageCompany = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/logo');
    },
    filename: (req, file, cb) => {
        const account_id = req.params.company_id;

        if (account_id) {
            const newFilename = `company_avatar_${company_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});
const storageEvent = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/poster/events');
    },
    filename: (req, file, cb) => {
        const account_id = req.params.event_id;

        if (account_id) {
            const newFilename = `event_poster_${event_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});
const storageNews = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/poster/news');
    },
    filename: (req, file, cb) => {
        const account_id = req.params.news_id;

        if (account_id) {
            const newFilename = `news_poster_${news_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});
const uploadUser = multer({ storageUser });
const uploadCompany = multer({ storageCompany });
const uploadEvent = multer({ storageEvent });
const uploadNews = multer( { storageNews });

module.exports = {
    uploadUser,
    uploadEvent,
    uploadCompany,
    uploadNews
};