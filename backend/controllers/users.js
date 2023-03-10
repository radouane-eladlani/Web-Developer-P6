/* on importe le model utilisateur */
const { Utilisateur } = require("../mongo")
const bcrypt = require("bcrypt")
/* on cree une fonction pour ajouter un utilisateur a la base de donnees */
async function creerUtilisateur(req, res) {
    const email = req.body.email
    const password = req.body.password
    const hacherPassword = await hachePassword(password)
    console.log("password:", password)
    console.log("hacherPassword:", hacherPassword)

    const utilisateur = new Utilisateur({ email: email, password: hacherPassword })


    /* on enregistre l'utilisateur dans la base de donnees */
    utilisateur
        .save()
        .then(() => res.send({ message: "Inscription réussie !" }))
        .catch((err) => console.log("utilisateur pas enregistrer", err))
}

async function loginUtilisateur(req, res) {
    const email = req.body.email
    const password = req.body.password
    const utilisateur = await Utilisateur.findOne({ email: email })

    const estPasswordOk = await bcrypt.compare(password, utilisateur.password)
     if (estPasswordOk) {
        console.log("Mot de passe réussie");
        res.status(200).send({ message: "Mot de passe réussie" })
    }
    else {
        res.status(403).send({ message: "Mot de passe incorrect" })
    }
   

    console.log("utilisateur", utilisateur)
    console.log("etPasswordOk", estPasswordOk)
}

function hachePassword(password) {
    /* il va chiffrer le mot de passe 10x pour le rendre plus securise */
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}

module.exports = { creerUtilisateur, loginUtilisateur }

