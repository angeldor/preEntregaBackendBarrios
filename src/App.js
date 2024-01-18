const express = require("express");
const app = express();
const router = require("./router");

app.use(express.json());
app.use("/", router);
app.listen(8080, () => {
  console.log("Aplicación funcionando en el puerto 8080");
});
