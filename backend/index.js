const {app, express} = require("./server")
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

/* on importe la fonction creerUtilisateur */
const {creerUtilisateur, loginUtilisateur} = require("./controllers/users")
const {creerSauce, recupererSauces, recupererIdSauce} = require("./controllers/sauces")

/* on importe la fonction authentifierUser pour verifier le token */
const {upload} = require("./middleware/multer")
const {authentifierUser} = require("./middleware/auth")

/* on utilise la methode post avec la route "/api/auth/signup" 
et on passe une fonction qui prend en parametre req et res 
pour ajouter l'utilisateur a la base de donnees */ 
app.post("/api/auth/signup", creerUtilisateur)
app.post ("/api/auth/login", loginUtilisateur)
app.get("/api/sauces", authentifierUser, recupererSauces)
app.post("/api/sauces",authentifierUser,upload.single("image"), creerSauce)
app.get("/api/sauces/:id", authentifierUser, recupererIdSauce)

/* l'application va reagir a la route "/" et va excuter la fonction */
app.get("/", (req, res) => 
  res.send("Hello World!"))

app.use("/images", express.static(path.join(__dirname, "images")))

/* ecoute sur le port 3000 avec app.listen */
app.listen(port, () => 
  console.log("listening on port", + port))