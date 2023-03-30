/*jsonwebtoken est un module qui permet de créer des tokens d'authentification*/
const jwt = require("jsonwebtoken")

/* on cree une fonction authentifierUser qui prend en parametre req, res et next */
function authentifierUser(req, res, next) {
    /* on recupere le header dans la requete */
    const header = req.header("Authorization")
    /* si header egale a null en return un status 403 avec un message: invalide */
    if (header == null)
        return res.status(403).send({ message: "invalide" })
    /* on recupere le token (' ') [1] dans le header */
    const token = header.split(" ")[1]
    /* si token egale a null en return un status 403 avec un message: token ne peut pas être nul */
    if (token == null) {
        return res.status(403).send({ message: "token ne peut pas être nul" })
    }
    /* on utilise try catch pour verifier le token avec jwt.verify */
    try {
        const decodedToken = jwt.verify(token, `${process.env.JWT_PASSWORD}`)
        /* on recupere l'id de l'utilisateur dans le token */
        const userId = decodedToken.userId
        /* on ajoute l'id de l'utilisateur dans la requete */
    req.auth = {
        authentifierUserId : userId
    };
    }
    /* si erreur on return un status 403 avec un message: Accéder au compte non autorisé */
    catch (err) {
        return res.status(401).send({ message: "Échec d'authentification" })
    }
    /* on utilise next pour passer a la fonction suivante */
    next()
}


module.exports = { authentifierUser }