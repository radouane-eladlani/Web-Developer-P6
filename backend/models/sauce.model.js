const mongoose = require("mongoose")

/*on creer un schema pour la sauce et on lui passe un objet */
const sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer : String,
    description : String,
    mainPepper : String, 
    imageUrl : String, 
    heat : Number, 
    likes : Number, 
    dislikes : Number, 
    usersLiked : Array,
    usersDisliked: Array
})

/* on cree un modele pour les utilisateurs */
const Sauce = mongoose.model("Sauce", sauceSchema)

module.exports = {mongoose, Sauce}