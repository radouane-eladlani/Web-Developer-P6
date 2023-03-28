 /*on importe multer pour gerer les fichiers entrants dans les requetes HTTP*/
const multer = require("multer")
/*on cree une constante storage pour utiliser multer.diskStorage*/
const storage = multer.diskStorage
({destination: "images/", filename: faireFilename})
/*on cree une constante upload pour utiliser multer et la variable storage*/
const upload = multer({storage})
/*on cree une fonction pour mettre le file original et ensuite remplacer les espaces par des tirets*/
function faireFilename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-"))
}
module.exports = {upload}