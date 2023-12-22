const fs = require('fs')

class ProductManager {
  constructor(filePath) {
    this.path = filePath
    this.products = this.loadProducts()
    this.lastProductId = this.calculateLastProductId()
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      // Si el archivo no existe o hay algún error, se inicializa con un arreglo vacío.
      return []
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2)
    fs.writeFileSync(this.path, data, 'utf8')
  }

  calculateLastProductId() {
    const lastProduct = this.products[this.products.length - 1]
    return lastProduct ? lastProduct.id : 0
  }

  addProduct({ title, description, price, image, code, stock }) {
    // Validar campos obligatorios
    if (!title || !description || !price || !image || !code || !stock) {
      throw new Error("All fields are required.")
    }

    // Validar que el código no esté repetido
    if (this.products.some((p) => p.code === code)) {
      throw new Error(`Product with code ${code} already exists.`)
    }

    // Agregar producto con id autoincrementable
    const newProduct = {
      id: ++this.lastProductId,
      title,
      description,
      price,
      image,
      code,
      stock,
    }

    this.products.push(newProduct)
    this.saveProducts() // Guardar cambios en el archivo
    return newProduct
  }

  getProducts() {
    return this.products
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) {
      throw new Error(`Product with id ${productId} not found.`)
    }
    return product
  }

  updateProduct(productId, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === productId)
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found.`)
    }

    this.products[index] = { ...this.products[index], ...updatedProduct }
    this.saveProducts() // Guardar cambios en el archivo
    return this.products[index]
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId)
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found.`)
    }

    this.products.splice(index, 1)
    this.saveProducts() // Guardar cambios en el archivo
  }
}

// Uso de la clase ProductManager
const productManager = new ProductManager('./path/to/products.json')

// Ejemplos de uso
console.log("Initial Products:", productManager.getProducts());

const newProduct = productManager.addProduct({
  title: "New Product",
  description: "This is a new product",
  price: 150,
  image: "New Image",
  code: "new123",
  stock: 10,
});

console.log("Products after adding a new product:", productManager.getProducts());

try {
  const retrievedProduct = productManager.getProductById(newProduct.id);
  console.log("Retrieved Product:", retrievedProduct);
} catch (error) {
  console.error(error.message);
}

try {
  const updatedProduct = productManager.updateProduct(newProduct.id, {
    price: 180,
    stock: 15,
  });
  console.log("Updated Product:", updatedProduct);
} catch (error) {
  console.error(error.message);
}

console.log("Products after updating a product:", productManager.getProducts());

try {
  productManager.deleteProduct(newProduct.id);
  console.log("Product deleted successfully.");
} catch (error) {
  console.error(error.message);
}

console.log("Products after deleting a product:", productManager.getProducts());