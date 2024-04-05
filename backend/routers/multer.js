const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
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

const upload = multer({ storage });

module.exports = upload;