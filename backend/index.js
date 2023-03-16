const {app, express} = require("./server")
const {sauceRouter} = require("./routers/sauce.router")
const {authRouter} = require("./routers/auth.router")
const port = 3000
const mongoose = require("mongoose")
const path = require("path")

const password = process.env.PASSWORD
const nomUtilisateur = process.env.NOMUTILISATEUR
const uri = `mongodb+srv://${nomUtilisateur}:${password}@cluster0.kwulfvi.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri).then(() => 
    console.log("Connecter a la base de donnees"))
.catch((err) => 
    console.log("Erreur de connexion:", err))

app.use("/api/sauces", sauceRouter)
app.use("/api/auth", authRouter)

/* l'application va reagir a la route "/" et va excuter la fonction */
app.get("/", (req, res) => 
  res.send("Hello World!"))

app.use("/images", express.static(path.join(__dirname, "images")))

/* ecoute sur le port 3000 avec app.listen */
app.listen(port, () => 
  console.log("listening on port", + port))