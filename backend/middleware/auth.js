const jwt = require("jsonwebtoken")

function authentifierUser(req, res, next) {
    const header = req.header("Authorization")
    if (header == null) 
        return res.status(403).send({ message: "invalide" })

    const token = header.split(" ")[1]
    if (token == null)  {
        return res.status(403).send({ message: "token ne peut pas être nul" })
    }
    try {
        jwt.verify(token, process.env.JWT_PASSWORD)
    }catch(err){
        return res.status(403).send({ message: "Non autorisé à accéder au compte" })
    }
    next()
}

module.exports = { authentifierUser }