/*mongoose interagit avec la base de donnees */
const mongoose = require("mongoose")

/*on creer un schema pour la sauce et on lui passe un objet */
const sauceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: {type: String, required: true },
    manufacturer : {type: String, required: true },
    description :  {type: String, required: true },
    mainPepper : {type: String, required: true}, 
    imageUrl : {type: String, require: true},
    heat : {type: Number, default:0},
    likes : {type: Number, default:0},
    dislikes : {type: Number, default:0},
    usersLiked : {type: [String]},
    usersDisliked: {type:[String]}
})

/* on cree un modele pour les utilisateurs */
const Sauce = mongoose.model("Sauce", sauceSchema)

module.exports = {mongoose, Sauce}