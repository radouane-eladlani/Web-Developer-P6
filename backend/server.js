/* dotenv pour utiliser les variables d'environnement et les cacher */
require("dotenv").config()
/* exportation de express vers le fichier index.js */
const express = require("express")
/* on cree une constante app pour utiliser express */
const app = express()
/* cors pour autoriser les requetes pour que le front puisse communiquer avec le back */
const cors = require("cors")
/* on utilise middleware cors pour autoriser les requêtes */
app.use(cors())
/* on utilise middleware express.json() pour analyser les requêtes users et sauces */
app.use(express.json())
/* exportation de app et express vers le fichier index.js */
module.exports = {app, express}