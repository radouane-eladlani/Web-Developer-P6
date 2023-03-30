/*on importe le modele sauce*/
const { Sauce } = require("../models/sauce.model")
/*unlink pour supprimer l'images dans le dossier images*/
const { unlink } = require("fs")

/* on cree une fonction pour recuperer les sauces */
function recupererSauces(req, res) {
    /*on utilise find pour recuperer les sauces dans la base de donnees */
    Sauce.find({})
        /* on utilise then pour envoyer une reponse c'est a dire les sauces en json */
        .then((sauces) => res.send(sauces))
}

/* on cree une fonction pour recuperer une sauce avec son id et 
l'appeller dans les fonctions  */
function recupererSauceFindById(req, res) {
    /* on utilise findById pour recuperer une sauce avec son id dans la base de donnees*/
    return Sauce.findById(req.params.id)
}
/* on cree une fonction pour que au click sur une sauce on puisse 
recuperer l'id de la sauce */
function recupererSauceAvecId(req, res) {
    /*on utilise recupererSauceFindById pour recuperer une sauce avec son id dans la base de donnees*/
    return recupererSauceFindById(req, res)
        /* on utilise then pour envoyer la fonction status404ou200 
        si il y a un 404 ou un 200 dans la base de donnees*/
        .then(sauce => status404ou200(sauce, res))
        /* on utilise catch avec la fonction  si il y a une erreur 404 */
        .catch((err) => status404ou200(err))
}
/* 
on creer la fonction pour savoir si le userId est different de l'userId de la sauce */
async function possibiliteDeModifierOuSupprimer(sauceId, userId) {

    try {
        /* on utilise await pour attendre que la sauce soit trouvee */
        const result = await Sauce.findById(sauceId);
        /* on utilise return pour retourner le resultat, userId egale stricte a  
        l'userId de la sauce */
        return result.userId === userId;

    }
    /*si erreur on return false */
     catch (err) {
        return false;
    }
}

async function deleteIdSauce(req, res) {
    /*on utilise req.params.id pour recuperer l'id de la sauce*/
    const sauceId = req.params.id;
    /* si différent de req.auth on return un status 401 avec un message: Non authentifié */
    if (!req.auth) {
        return res.status(401).send({ message: 'Non authentifié' });
    }
    /* on utilise la fonction possibiliteDeModifierOuSupprimer pour verifier si l'utilisateur
    peut supprimer la sauce */
    const possibiliteDeSupprimer = await possibiliteDeModifierOuSupprimer(sauceId, req.auth.authentifierUserId);
    if (!possibiliteDeSupprimer) {
        return res.status(403).send({ message: 'Impossible de supprimer cette sauce' });
    }
    try {
        /* on utilise findByIdAndDelete pour supprimer la sauce avec son id dans la base de donnees*/
        const sauce = await Sauce.findByIdAndDelete(sauceId);
        /* on utilise deleteImageSauce pour supprimer l'image de la base de donnees et du dossier images*/
        await deleteImageSauce(sauce);
        /* on utilise send pour envoyer une reponse c'est a dire la sauce en json */
        res.send({ message: sauce });
    } 
    /* si erreur interne on return un status 500 avec un message: err */
    catch (err) {
        res.status(500).send({ message: err });
    }
}
/* on creer la fonction pour supprimer l'image de la base de donnees et du dossier images*/
function deleteImageSauce(sauce) {
    /* on utlilise la variable imageUrl */
    const imageUrl = sauce.imageUrl
    /* on utilise split pour separer l'url de l'image et on utilise at
     pour recuperer le dernier element de l'url c'est a dire le nom de l'image */
    const imgSupprimer = imageUrl.split("/").at(-1)
    /* on utilise unlink pour supprimer l'image dans le dossier images et dans 
    la base de donnees */
    unlink(`images/${imgSupprimer}`, (err) => {
        /* si il y a une erreur on lance l'erreur*/
        if (err) throw err
    })
    return sauce
}
/* on cree une fonction pour que au click sur submit on puisse modifier la sauce*/
async function modifierSauce(req, res) {
    /* on utilise req.params.id pour recuperer l'id de la sauce */
    const sauceId = req.params.id
    /* on utilise la fonction possibiliteDeModifierOuSupprimer pour verifier si l'utilisateur
    peut modifier la sauce */
    const possibiliteDeModifier = (await possibiliteDeModifierOuSupprimer( sauceId, req.auth.authentifierUserId))
    if (!possibiliteDeModifier) {
        return res.status(403).send({ message: 'Impossible de modifier cette sauce' })
    }
    /*on utilise req.file pour recuperer l'image de la sauce dans la base de donnees si different
    de null*/
    const modifierImg = req.file != null
    /*on utilise modifierImgSauce pour modifier l'image de la sauce dans la base de donnees si different*/
    const payload = modifierImgSauce(modifierImg, req)
    /* on utilise la variable ancienneImageUrl pour recuperer l'ancienne image de la sauce */
    let ancienneImageUrl = ""
    /* on utilise findByIdAndUpdate pour modifier une sauce avec son id dans la base de donnees*/
    Sauce.findByIdAndUpdate(sauceId, payload)
        /* on utilise then pour envoyer une reponse c'est a dire la sauce.imageUrl en json */
        .then((sauce) => {
            /* on utilise la variable ancienneImageUrl pour recuperer l'ancienne image de la sauce */
            ancienneImageUrl = sauce.imageUrl
            /* on utilise la fonction status404ou200 pour envoyer la reponse  */
            status404ou200(sauce, res)
        })
        /* on utilise la fonction deleteAncienneImage pour supprimer dans le dossier images 
        l'ancienne image de la sauce apres modification de l'image */
        .then((sauce) => deleteAncienneImage(ancienneImageUrl, sauce))
        /* on utilise catch si il y a une erreur  */
        .catch((err) => console.error("problème de téléchargement d'image", err))
}
/* on créer une fonction pour modifier l'image*/
function modifierImgSauce(modifierImg, req) {
    /*si il y a pas d'image on retourne le body c'est a dire la sauce sans image */
    if (!modifierImg) return req.body
    /* on utilise JSON.parse pour recuperer le body de la sauce */
    const payload = JSON.parse(req.body.sauce)
    /* imageUrl en JSON.parse ensuite on utilise req.protocol pour recuperer le protocole http  ensuite 
    req.get pour recuperer le host ensuite on utilise req.file.filename le nom de l'image */
    payload.imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    /* on retourne le payload c'est a dire la sauce avec l'image */
    return payload
}
/* on creer la fonction pour supprimer l'ancienne image de la sauce apres modification de l'image */
function deleteAncienneImage(imageUrlASupprimer) {
    /* on utilise split pour separer l'url de l'image et on utilise at 
    pour recuperer le dernier element de l'url c'est a dire le nom de l'image */
    const nomImage = imageUrlASupprimer.split("/").at(-1)
    /* on utilise unlink pour supprimer l'image dans le dossier images*/
    unlink(`images/${nomImage}`, (err) => {
        if (err) throw err
    })
}
/* on creer la fonction pour pouvoir l'utiliser dans differentes fonctions */
function status404ou200(dataResponse, res) {
    if (dataResponse == null) {
        /* on utilise send pour envoyer une reponse avec un status 404 */
        return res.status(404).send({ message: "sauce non trouvé" })
    }
    else {
        /* on utilise send pour envoyer une reponse avec un status 200 */
        return res.status(200).send(dataResponse)
    }
}
/* on creer la fonction pour creer la sauce*/
function creerSauce(req, res) {
    /* on utilise la variable sauce pour une nouvelle sauce et on utilise JSON.parse 
    pour recuperer le body de la sauce */
    const sauce = new Sauce(JSON.parse(req.body.sauce))
    /*la route pour aller vers le dossier images */
    const imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    /* on utilise la variable imageUrl pour recuperer l'image de la sauce */
    sauce.imageUrl = imageUrl
    /* on utilise save pour enregistrer la sauce dans la base de donnees */
    return sauce.save()
        /* on utilise then pour envoyer une reponse avec un status 201 create avec le message sauce en json */
        .then((sauce) => {
            res.status(201).send({ message: sauce })
        })
        /* catch si il y a une erreur */
        .catch(console.error)
}

function likeEtDisLike(req, res) {
    /* on utilise req.body.like pour recuperer la valeur de like */
    let like = req.body.like
    /* on utilise req.body.userId pour recuperer l'id de l'utilisateur */
    let userId = req.body.userId
    /*on verifie que la valeur de like est bien 0, 1 ou -1 si different en return 403 */
    if (![1, -1, 0].includes(like)) {
        return res.status(403).send({ message: "demande non valide" })
    }
    /* on utilise la fonction recupererSauceFindById pour recuperer la sauce avec son id */
    recupererSauceFindById(req, res)
        /* on utilise then pour renvoyer une reponse avec la fonction gererLikeOuDislike avec en parametre
        la sauce, le like, l'id de l'utilisateur et la reponse */
        .then((sauce) => gererLikeOuDisLike(sauce, like, userId, res))
        /* on utilise then pour save la sauce avec le like ou dislike*/
        .then(sauce => sauce.save())
        /* on utilise then pour envoyer une reponse de la fonction status404ou200*/
        .then((sauce) => status404ou200(sauce, res))
        /*on utilise catch si il y a une erreur interne */
        .catch((err) => res.status(500).send(err))
}
/* on creer la fonction gererLikeOuDislike en parametre la sauce, le like, 
l'id de l'utilisateur et la reponse */
function gererLikeOuDisLike(sauce, like, userId, res) {
    /* si like et egale strict 1 ou dislike et egale strict -1 on return la fonction en parametre sauce
    id de l'utilisateur et le like ou le dislike */
    if (like === 1 || like === -1) return incrementLikeOuDisLike(sauce, userId, like)
    /* si like et egale strict 0 on return la fonction resetLike en parametre sauce
    id de l'utilisateur et la reponse */
    if (like === 0) return resetLike(sauce, userId, res)
}
/* on cree une fonction pour que l'utilisateur like ou dislike une sauce */
function incrementLikeOuDisLike(sauce, userId, like) {
    if (like === 1) {
        /* on utilise la fonction includes pour verifier si l'id de l'utilisateur est deja dans le tableau*/
        if (sauce.usersLiked.includes(userId)) {
            return
        }
        /*si l'id de l'utilisateur est deja dans le tableau */
        if (sauce.usersDisliked.includes(userId)) {
            /* on utilise la fonction indexOf pour recuperer l'index de l'id de l'utilisateur dans le tableau*/
            const index = sauce.usersDisliked.indexOf(userId)
            /* on utilise la fonction splice pour supprimer l'id de l'utilisateur dans le tableau de usersdislike apres avoir liké*/
            sauce.usersDisliked.splice(index, 1)
            --sauce.dislikes
        }
        /* on utilise la fonction push pour ajouter l'id de l'utilisateur dans le tableau de usersliked*/
        sauce.usersLiked.push(userId)
        /* on utilise ++ pour incrementer le nombre de like de la sauce*/
        ++sauce.likes

    } else if (like === -1) {
        /* on utilise la fonction includes pour verifier si l'id de l'utilisateur est deja dans le tableau*/
        if (sauce.usersDisliked.includes(userId)) {
            return
        }
        /*si l'id de l'utilisateur est deja dans le tableau */
        if (sauce.usersLiked.includes(userId)) {
            /* on utilise la fonction indexOf pour recuperer l'index de l'id de l'utilisateur dans le tableau*/
            const index = sauce.usersLiked.indexOf(userId)
            /* on utilise la fonction splice pour supprimer l'id de l'utilisateur dans le tableau userslike apres avoir dislike*/
            sauce.usersLiked.splice(index, 1)
            /* on utilise -- pour decrementer le nombre de like de la sauce*/
            --sauce.likes
        }
        /* on utilise la fonction push pour ajouter l'id de l'utilisateur dans le tableau*/
        sauce.usersDisliked.push(userId)
        ++sauce.dislikes
    }
    /* on return la sauce avec le like ou dislike incrementer*/
    return sauce
}
/* on cree une fonction pour que si l'utilisateur veut 
annuler son like ou dislike*/
function resetLike(sauce, userId, res) {
    /*on utilise la variable usersLiked pour recuperer les utilisateurs qui ont liker la sauce*/
    const usersLiked = sauce.usersLiked
    /*on utilise la variable usersDisliked pour recuperer les utilisateurs qui ont disliker la sauce*/
    const usersDisliked = sauce.usersDisliked
    /*verifier si l'id de l'utilisateur a deja liked ou disliked avec la methode "every" si oui 
    il ne peut pas liked et a la fois disliked alors on return demande non  valide */
    if ([usersLiked, usersDisliked].every((array) => array.includes(userId)))
        return promises.reject("demande non valide")
    /* si l'id de l'utilisateur est present dans l'un des tableaux usersLiked ou usersDisliked 
    alors on return demande non valide */
    if (![usersLiked, usersDisliked].some((array) => array.includes(userId)))
        return promises.reject("demande non valide")
    /* si l'id de l'utilisateur est present dans le tableau usersLiked alors on decremente le like*/
    if (usersLiked.includes(userId)) {
        /*si l'id de l'utilisateur est present dans le tableau usersDisliked alors on decremente le like*/
        --sauce.likes
        /* La méthode filter crée et retourne un nouveau tableau contenant tous les ids du tableau d'origine*/
        sauce.usersLiked = usersLiked.filter((id) => id !== userId)
    } else {
        /*si l'id de l'utilisateur est present dans le tableau usersDisliked alors on decremente le dislike*/
        --sauce.dislikes
        sauce.usersDisliked = usersDisliked.filter((id) => id !== userId)
    }
    return sauce
}

module.exports = { creerSauce, recupererSauces, recupererSauceAvecId, deleteIdSauce, modifierSauce, likeEtDisLike }
