require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

/* on utilise middleware cors pour autoriser les requêtes */
app.use(cors())
/* on utilise middleware express.json() pour analyser les requêtes */
app.use(express.json())

module.exports = {app, express}