const {Sauce} = require("../models/sauce.model")

/* on cree une fonction pour recuperer les sauces */
function recupererSauces( req, res) {
     Sauce.find({}).then((sauces) => res.send(sauces )) 
}
/* on cree une fonction pour que au click sur une sauce on puisse 
recuperer l'id de la sauce avec la methode get*/
function recupererIdSauce(req, res){
    Sauce.findById(req.params.id).then((sauce) => res.send(sauce))
}

function creerSauce(req, res){
    console.log(req.body);
    const sauce = new Sauce(JSON.parse(req.body.sauce))
    const imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    sauce.imageUrl = imageUrl
    return sauce.save()
    .then ((message) =>{
        res.status(201).send({message: message})
     return console.log("sauce enregistré",message)})
     .catch(console.error)
}

module.exports = { creerSauce, recupererSauces, recupererIdSauce}
