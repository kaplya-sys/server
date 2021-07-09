const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req, file, callBack) {
        callBack(null, 'uploads/')
    },
    filename(req, file, callBack) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        callBack(null, `${date}-${file.originalname}`)
    }
});

const fileFilter = (req, file, callBack) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callBack(null, true)
    } else {
        callBack(null, false)
    }
};

const limits = {
    fileSize: 600 * 600
};

module.exports = multer({storage, fileFilter, limits});