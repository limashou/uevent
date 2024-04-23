const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storageUser = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './images/avatar';
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
            } else {
                cb(null, uploadDir);
            }
        });
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
        const uploadDir = './images/logo';
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
            } else {
                cb(null, uploadDir);
            }
        });
    },
    filename: (req, file, cb) => {
        const { company_id } = req.params;

        if (company_id) {
            const newFilename = `company_avatar_${company_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('company_id not provided'));
        }
    }
});

const storageEvent = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './images/poster/events';
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
            } else {
                cb(null, uploadDir);
            }
        });
    },
    filename: (req, file, cb) => {
        const event_id = req.params.event_id;

        if (event_id) {
            const newFilename = `event_poster_${event_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});

const storageNews = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './images/poster/news';
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
            } else {
                cb(null, uploadDir);
            }
        });
    },
    filename: (req, file, cb) => {
        const { news_id } = req.params;

        if (news_id) {
            const newFilename = `news_poster_${news_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('news_id not provided in params'));
        }
    }
});

const uploadUser = multer({ storage: storageUser });
const uploadCompany = multer({ storage: storageCompany });
const uploadEvent = multer({ storage: storageEvent });
const uploadNews = multer( { storage: storageNews });

module.exports = {
    uploadUser,
    uploadEvent,
    uploadCompany,
    uploadNews
};