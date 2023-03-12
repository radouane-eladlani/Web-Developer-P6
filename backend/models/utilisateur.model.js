const mongoose = require("mongoose")

/* on cree un schema pour les utilisateurs */
const utilisateurSchema = new mongoose.Schema({
    /* on cree un champ email qui est de type string et qui est unique */
    email: {type: String, required: true, unique: true},
    /* on cree un champ password qui est de type string */
    password:{type: String, required: true}
})

/* on cree un modele pour les utilisateurs */
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema)

module.exports = {mongoose, Utilisateur}