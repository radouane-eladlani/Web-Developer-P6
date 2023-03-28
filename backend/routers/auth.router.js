
/* on importe la fonction creerUtilisateur et loginUtilisateur */
const {creerUtilisateur, loginUtilisateur} = require("../controllers/users")
/*  creer des routes ensuite on exporte 
authRouter et on export dans le fichier index.js */
const express = require("express");
const authRouter = express.Router();

/* on utilise la methode post avec la route "/api/auth/signup" 
et on passe une fonction qui prend en parametre req et res 
pour ajouter l'utilisateur a la base de donnees */ 
authRouter.post("/signup", creerUtilisateur)
authRouter.post ("/login", loginUtilisateur)

module.exports = {authRouter}