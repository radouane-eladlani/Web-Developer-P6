/* on importe le model utilisateur */
const { Utilisateur } = require("../models/utilisateur.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
/* on cree une fonction pour ajouter un utilisateur a la base de donnees */
async function creerUtilisateur(req, res) {
    const email = req.body.email
    const password = req.body.password
    const hacherPassword = await hachePassword(password)
    /* on cree un nouvel utilisateur */
    const utilisateur = new Utilisateur({ email: email, password: hacherPassword })

    /* on enregistre l'utilisateur dans la base de donnees */
    utilisateur
        .save()
        .then(() => res.send({ message: "utilisateur enregistré !" }))
        .catch((err) => console.log("utilisateur pas enregistrer", err))
}
/* on cree une fonction pour connecter un utilisateur a la base de donnees */
async function loginUtilisateur(req, res) {
    try {
        /* on recupere l'email et le mot de passe de la requete */
        const email = req.body.email
        const password = req.body.password
        /* on cherche l'utilisateur dans la base de donnees */
        const utilisateur = await Utilisateur.findOne({ email: email })
        /* on compare le mot de passe avec le mot de passe hacher */
        const estPasswordOk = await bcrypt.compare(password, utilisateur.password)
        if (estPasswordOk) {
            console.log("Mot de passe correct");
            const token = creerToken(email)
            return res.status(200).send({ userId: utilisateur._id, token: token, message: "connexion réussie" })
        } else {
            console.log("Mot de passe incorrect");
            return res.status(401).send({ message: "mot de passe échoué" })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: "erreur interne" })
    }
}

function hachePassword(password) {
    /* il va chiffrer le mot de passe 10x pour le rendre plus securise */
    const saltRounds = 10;
    /* on retourne le mot de passe hacher */
    return bcrypt.hash(password, saltRounds)
}

function creerToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD
    const token = jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" })
    return token


}

module.exports = { creerUtilisateur, loginUtilisateur }

