const express = require("express");
const { productManager, cartManager } = require("./ProductManager");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(bodyParser.json());

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/", (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      code,
      stock,
      category,
      thumbnails,
    } = req.body;

    const newProduct = productManager.addProduct({
      title,
      description,
      price,
      image,
      code,
      stock,
      category,
      thumbnails,
    });
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

router.put("/products/:id",(req, res) => {
  const productId = parseInt(req.params.id, 10)
  const updatedFields = req.body

  try{
    const updatedProduct = productManager.updateProduct(productId, updatedFields)
    res.send(updatedProduct)
  }catch (error){
    res.status(404).send(`Error 404: ${error.message}`)
  }
})
router.get("/products", (req, res) => {
  //Entrada de datos
  let productos = productManager.getProducts();

  const limit = req.query.limit;

  if (limit) {
    productos = productos.slice(0, parseInt(limit, 10));
  }
  //Salida de datos
  res.send(productos);
});

router.get("/product/:id", (req, res) => {
  const productId = req.params.id;

  const product = productManager.getProductById(productId);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Error 404: Producto no encontrado");
  }
});

router.get("/carts", (req, res) => {
  let carritos = cartManager.getAllCarts();

  const limit = req.query.limit;

  if (limit) {
    carritos = carritos.slice(0, parseInt(limit, 10));
  }

  res.send(carritos);
});
//Por alguna razon no logro la ruta localhost:8080/cart/:id
//Si lo llamo desde un console.log un id especifico funciona pero si lo pido por una variable me devuelve undefined
router.get("/cart/:id", (req, res) => {
  let cartid = req.params.id;

  let cart = productManager.getCart(cartid);

  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send("Error 404, carrito no encontrado");
  }
});

module.exports = router;
