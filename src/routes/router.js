const express = require("express")
const productManager = require("../ProductManager")

const router = express.Router()

router.get("/ping", (req, res)=>{
    res.send("pong")
})

router.get("/", (req, res) => {
    res.send("Hello World")
})

router.get("/products", (req, res) => {
    //Entrada de datos
    let productos = productManager.getProducts()
  
    const limit = req.query.limit
  
    if (limit) {
      productos = productos.slice(0, parseInt(limit, 10))
    }
    //Salida de datos
    res.send(productos)
})

router.get("/product/:id", (req, res) => {
    const productId = req.params.id
  
    const product = productManager.getProductById(productId)
  
    if (product) {
      res.send(product)
    } else {
      res.status(404).send("Error 404: Producto no encontrado")
    }
})

module.exports = router