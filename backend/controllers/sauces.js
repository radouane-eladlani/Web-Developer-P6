const { Sauce } = require("../models/sauce.model")
const { unlink } = require("fs")

/* on cree une fonction pour recuperer les sauces */
function recupererSauces(req, res) {
    Sauce.find({})
        .then((sauces) => res.send(sauces))
        .catch((err) => res.status(500).send({ message: err }))
}

function recupererSauce(req, res) {
    return Sauce.findById(req.params.id)
}
/* on cree une fonction pour que au click sur une sauce on puisse 
recuperer l'id de la sauce avec la methode get*/
function recupererSauceAvecId (req, res) {
    recupererSauce(req, res)
        .then(sauce => erreurStatus(sauce, res))
        .catch((err) => erreurStatus (err))
}
/* on cree une fonction pour que au click sur une sauce on puisse la supprimer de la base de données*/
function deleteIdSauce(req, res) {
    const { id } = req.params
    Sauce.findByIdAndDelete(id)
        .then(deleteImageSauce)
        .then((sauce) => res.send({ message: sauce }))
        .catch((err) => res.status(500).send({ message: err }))
}
function deleteImageSauce(sauce) {
    const imageUrl = sauce.imageUrl
    const imgSupprimer = imageUrl.split("/").at(-1)
    unlink(`images/${imgSupprimer}`, (err) => {
        if (err) throw err
    })
    return sauce
}

function modifierSauce(req, res) {
    const id = req.params.id
    const modifierImg = req.file != null
    const payload = modifierImgSauce(modifierImg, req)
    let ancienneImageUrl = ""
    Sauce.findByIdAndUpdate(id, payload)
        .then((sauce) => {
            ancienneImageUrl = sauce.imageUrl
            erreurStatus(sauce, res)
        })
        .then((sauce) => deleteAncienneImage(ancienneImageUrl, sauce))
        .catch((err) => console.error("probleme telechargement image", err))
}

function modifierImgSauce(modifierImg, req) {
    /*si il y a pas d'image on retourne le body */
    if (!modifierImg) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    return payload
}

function deleteAncienneImage(imageUrlASupprimer) {
    const nomImage = imageUrlASupprimer.split("/").at(-1)
    unlink(`images/${nomImage}`, (err) => {
        if (err) throw err
    })
}


function erreurStatus(dataResponse, res) {
    if (dataResponse == null) {
        return res.status(404).send({ message: "sauce non trouvé" })
    }
    else {
        return res.status(200).send(dataResponse)
    }
}

function creerSauce(req, res) {
    const sauce = new Sauce(JSON.parse(req.body.sauce))
    const imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    sauce.imageUrl = imageUrl
    return sauce.save()
        .then((sauce) => {
            res.status(201).send({ message: sauce })
        })
        .catch(console.error)
}

function likeOuDisLike(req, res) {
let like = req.body.like
let userId = req.body.userId
        /*on verifie que la valeur de like est bien 0, 1 ou -1 */
    if (![1,-1,0].includes(like)) return res.status(403).send({ message: "demande non valide" })

    recupererSauce(req, res).then((sauces) => gererlikeOuDisLike(sauces, like, userId, res))
     .then(sauce => sauce.save())
     .then ((sauce) => erreurStatus(sauce, res))
     .catch((err) => res.status(500).send(err))
}

function gererlikeOuDisLike(sauce, like, userId, res,) {
    if (like === 1 || like === -1 )return incrementLikeOuDisLike(sauce, userId, like)
    if (like === 0) return resetLike(sauce, userId,res)
}

function incrementLikeOuDisLike(sauce, userId, like) {
    const usersLiked =  sauce.usersLiked 
    const usersDisliked = sauce.usersDisliked
    
    const likeArray = like === 1 ? usersLiked : usersDisliked
    if (likeArray.includes(userId)) return 
    likeArray.push(userId)

    like === 1 ? ++sauce.likes : ++sauce.dislikes 

    console.log ( "increment like",sauce )

    return sauce 
}
/* on cree une fonction pour que si l'utilisateur veut 
annuler son vote c'est a dire le like ou le dislike*/
function resetLike(sauce, userId,res) {
    console.log ("reset like",sauce)
    const usersLiked = sauce.usersLiked
    const usersDisliked = sauce.usersDisliked

    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
        return promises.reject ("demande non valide" )

    if (![usersLiked, usersDisliked].some((array) => array.includes(userId)))
    return promises.reject ("demande non valide")
    
    if(usersLiked .includes(userId)) {
        --sauce.likes
        sauce.usersLiked = usersLiked.filter((id) => id !== userId)
    } else {
        --sauce.dislikes
        sauce.usersDisliked = usersDisliked.filter((id) => id !== userId)
    }
    console.log ( "reset apres dislike ",sauce )
    return sauce 
}

module.exports = { creerSauce, recupererSauces, recupererSauceAvecId , deleteIdSauce, modifierSauce, likeOuDisLike }
