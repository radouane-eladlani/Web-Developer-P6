const express = require("express");
const sauceRouter = express.Router();
const {creerSauce, recupererSauces, recupererSauceAvecId , deleteIdSauce, modifierSauce,likeOuDisLike} = require("../controllers/sauces")
const {upload} = require("../middleware/multer")
const bodyParser = require("body-parser")
/* on importe la fonction authentifierUser pour verifier le token */
const {authentifierUser} = require("../middleware/auth")
sauceRouter.use(bodyParser.json())


sauceRouter.get("/", authentifierUser, recupererSauces)
sauceRouter.post("/",authentifierUser,upload.single("image"), creerSauce)
sauceRouter.get("/:id", authentifierUser, recupererSauceAvecId )
sauceRouter.delete("/:id", authentifierUser, deleteIdSauce)
sauceRouter.put("/:id", authentifierUser, upload.single("image"),modifierSauce)
sauceRouter.post("/:id/like", authentifierUser, likeOuDisLike)


module.exports = {sauceRouter}