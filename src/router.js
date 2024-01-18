const express = require("express");
const { productManager, cartManager } = require("./ProductManager");

const router = express.Router();

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

router.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  try {
    const updatedProduct = productManager.updateProduct(
      productId,
      updatedFields
    );
    res.send(updatedProduct);
  } catch (error) {
    res.status(404).send(`Error 404: ${error.message}`);
  }
});

router.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);

  try {
    productManager.deleteProduct(productId);
    res.send(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
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

router.post("/carts", (req, res) => {
  try {
    const newCartId = cartManager.createCart();
    res.status(201).send({ id: newCartId, items: [], total: 0 });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
})

router.get("/carts/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const cart = cartManager.getCart(cartId);

  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send(`Error 404: Cart with ID ${cartId} not found.`);
  }
});

router.post("/carts/:cid/products/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const productId = parseInt(req.params.pid, 10);
  const quantity = req.body.quantity || 1;

  try {
    cartManager.addToCart(cartId, productId, quantity);
    res.send("Product added to cart successfully.");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = router;
