
const express = require("express");
/* creer la variable SauceRouter pour*/
const sauceRouter = express.Router();
/* on importe les fonctions du controller sauce*/
const {creerSauce, recupererSauces, recupererSauceAvecId , deleteIdSauce, modifierSauce,likeEtDisLike} = require("../controllers/sauces")
const {upload} = require("../middleware/multer")
/* on importe la fonction authentifierUser pour verifier le token si le token est le meme*/
const {authentifierUser} = require("../middleware/auth")

/* les routes avec authentification */
sauceRouter.get("/", authentifierUser, recupererSauces)
sauceRouter.post("/",authentifierUser,upload.single("image"), creerSauce)
sauceRouter.get("/:id", authentifierUser, recupererSauceAvecId )
sauceRouter.delete("/:id", authentifierUser, deleteIdSauce)
sauceRouter.put("/:id", authentifierUser, upload.single("image"),modifierSauce)
sauceRouter.post("/:id/like", authentifierUser, likeEtDisLike)

/* exports vers index.js*/
module.exports = {sauceRouter}