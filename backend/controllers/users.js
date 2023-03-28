/* on importe le model utilisateur */
const { Utilisateur } = require("../models/utilisateur.model")
/* on importe bcrypt pour hacher le mot de passe et jwt pour creer un token */
const bcrypt = require("bcrypt")
/*on importe jwt pour creer un token*/
const jwt = require("jsonwebtoken")

/* on cree une fonction pour ajouter un utilisateur a la base de donnees */
async function creerUtilisateur(req, res) {
    /* on recupere l'email et le mot de passe de la requete */
    const email = req.body.email
    const password = req.body.password
    /* on hache le mot de passe */
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
        /* si le mot de passe est ok on cree un token avec la function creerToken */
        if (estPasswordOk) {
            const token = creerToken(utilisateur)
            return res.status(200).send({ userId: utilisateur._id, token: token, message: "connexion réussie" })
        /* sinon en return 401 mot de passe echoué */
        }else {
            return res.status(401).send({ message: "connexion invalide" })
        }
    /*catch erreur on return un status 500 avec un message: erreur interne */
    } catch (err) {
        return res.status(500).send({ message: "erreur interne" })
    }
}
/*on cree une fonction pour hacher le mot de passe*/
function hachePassword(password) {
    /* il va chiffrer le mot de passe 10x pour le rendre plus securise */
    const saltRounds = 10;
    /* on retourne le mot de passe hacher et il v chiffrer le mot de passe 10x */
    return bcrypt.hash(password, saltRounds)
}
/*on cree une fonction pour creer un token*/
function creerToken(utilisateur) {
    /* on recupere le mot de passe du token dans le fichier .env */
    const jwtPassword = process.env.JWT_PASSWORD
    /* jwt.sign permet de signé le token pour le validé ensuite 
    on recupere l'email et le mot de passe du token dans le fichier .env
    et on donne un temps d'expiration de 24h */
    const token = jwt.sign({ userId: utilisateur._id }, jwtPassword, { expiresIn: "24h" })
    /* on return le token pour l'utiliser dans la fonction loginUtilisateur */
    return token
}

module.exports = { creerUtilisateur, loginUtilisateur }

