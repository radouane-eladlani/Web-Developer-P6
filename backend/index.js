/* importation vers le fichier index.js */
const {app, express} = require("./server")
const {sauceRouter} = require("./routers/sauce.router")
const {authRouter} = require("./routers/auth.router")
/* on cree une constante port pour utiliser le port 3000 */
const port = 3000
/* mongoose pour utiliser la base de donnees */
const mongoose = require("mongoose")
/* path pour utiliser le chemin des images */
const path = require("path")
/* process.env pour utiliser les variables d'environnement */
const password = process.env.PASSWORD
const nomUtilisateur = process.env.NOMUTILISATEUR
/* connexion a la base de donnees mongoDB */
const uri = `mongodb+srv://${nomUtilisateur}:${password}@cluster0.kwulfvi.mongodb.net/?retryWrites=true&w=majority`
/* on utilise mongoose.connect pour se connecter a la base de donnees*/
mongoose.connect(uri).then(() => 
    console.log("Connecter a la base de donnees"))
.catch((err) => 
    console.log("Erreur de connexion:", err))
/* on utilise express.json pour analyser les requetes users et sauces */
app.use("/api/sauces", sauceRouter)
app.use("/api/auth", authRouter)

/* l'application va reagir a la route "/" et va excuter la fonction 
pour envoyer le message "Hello World!" */
app.get("/", (req, res) => 
  res.send("Hello World!"))
/* on utilise middleware express.static pour charger les images 
et passer le chemin des images */
app.use("/images", express.static(path.join(__dirname, "images")))

/* ecoute sur le port 3000 avec app.listen */
app.listen(port, () => 
  console.log("listening on port", + port))