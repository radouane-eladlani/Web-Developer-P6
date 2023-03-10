/*base de donnee mongoDB */
const mongoose = require("mongoose")
const password = process.env.PASSWORD
const nomUtilisateur = process.env.NOMUTILISATEUR
const uri = `mongodb+srv://${nomUtilisateur}:${password}@cluster0.kwulfvi.mongodb.net/?retryWrites=true&w=majority`
mongoose
.connect(uri)
.then(() => 
    console.log("Connecter a mongoose"))
.catch((err) => 
    console.log("Erreur de connexion:", err))

/* on cree un schema pour les utilisateurs */
const utilisateurSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password:{type: String, required: true}
})

/* on cree un modele pour les utilisateurs */
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema)

module.exports = {mongoose, Utilisateur}