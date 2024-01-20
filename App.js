const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const handlebars = require("express-handlebars")
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const router = require("./router")

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

app.use(express.json())
app.use("/", router)

io.on("connection", (socket) => { console.log("Usuario conectado") })
app.listen(8080, () => { console.log("Aplicación funcionando en el puerto 8080") })
