const express = require("express");
const app = express();
const router = require("./router");

app.use(express.json());
app.use("/", router);
app.listen(8080, () => {
  console.log("Aplicación funcionando en el puerto 8080");
});

// app.get("/ping", (req, res) => {
//   res.send("pong");
// });

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.get("/products", (req, res) => {
//   //Entrada de datos
//   let productos = productManager.getProducts();

//   const limit = req.query.limit;

//   if (limit) {
//     productos = productos.slice(0, parseInt(limit, 10));
//   }
//   //Salida de datos
//   res.send(productos);
// });

// app.get("/product/:id", (req, res) => {
//   const productId = req.params.id;

//   const product = productManager.getProductById(productId);

//   // res.send(product)
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send("Error 404: Producto no encontrado");
//   }
// });
