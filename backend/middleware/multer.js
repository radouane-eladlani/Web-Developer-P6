const multer = require("multer")

const storage = multer.diskStorage
({destination: "images/", filename: faireFilename})
const upload = multer({storage})
function faireFilename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
}
module.exports = {upload}