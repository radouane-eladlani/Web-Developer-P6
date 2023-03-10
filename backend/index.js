require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
/*connexion a la base de donnees */
require("./mongo")
/* on importe la fonction creerUtilisateur */
const {creerUtilisateur, loginUtilisateur} = require("./controllers/users")

/* on utilise middleware cors pour autoriser les requêtes */
app.use(cors())

/* on utilise middleware express.json() pour analyser les requêtes */
app.use(express.json())

/* on utilise la methode post avec la route "/api/auth/signup" 
et on passe une fonction qui prend en parametre req et res 
pour ajouter l'utilisateur a la base de donnees */ 
app.post("/api/auth/signup", creerUtilisateur)
app.post ("/api/auth/login", loginUtilisateur)

/* l'application va reagir a la route "/" et va excuter la fonction */
app.get("/", (req, res) => 
  res.send("Hello World!"))

/* ecoute sur le port 3000 avec app.listen */
app.listen(port, () => 
  console.log("listening on port", + port))