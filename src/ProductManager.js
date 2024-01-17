const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
    this.lastProductId = this.calculateLastProductId();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay algún error, se inicializa con un arreglo vacío.
      return [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, "utf8");
  }

  calculateLastProductId() {
    const lastProduct = this.products[this.products.length - 1];
    return lastProduct ? lastProduct.id : 0;
  }

  addProduct({ title, description, price, image, code, stock }) {
    // Validar campos obligatorios
    if (!title || !description || !price || !image || !code || !stock) {
      throw new Error("All fields are required.");
    }

    // Validar que el código no esté repetido
    if (this.products.some((p) => p.code === code)) {
      throw new Error(`Product with code ${code} already exists.`);
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
    };

    this.products.push(newProduct);
    this.saveProducts(); // Guardar cambios en el archivo
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((prod) => prod.id == id);
  }

  updateProduct(productId, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found.`);
    }

    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.saveProducts(); // Guardar cambios en el archivo
    return this.products[index];
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found.`);
    }

    this.products.splice(index, 1);
    this.saveProducts(); // Guardar cambios en el archivo
  }
}

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts();
    this.lastCartId = this.calculateLastCartId();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay algún error, se inicializa con un objeto vacío.
      return {};
    }
  }
  saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, data, "utf8");
  }

  calculateLastCartId() {
    const cartIds = Object.keys(this.carts);
    return cartIds.length > 0 ? Math.max(...cartIds.map(Number)) : 0;
  }

  createCart() {
    const newCartId = ++this.lastCartId;
    this.carts[newCartId] = { items: [], total: 0 };
    this.saveCarts(); // Guardar cambios en el archivo
    return newCartId;
  }

  getCart(cartId) {
    return this.carts[cartId];
  }

  getAllCarts(){
    return this.carts
  }

  addToCart(cartId, productId, quantity = 1) {
    if (!this.carts[cartId]) {
      throw new Error(`Cart with id ${cartId} not found.`);
    }

    const product = productManager.getProductById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found.`);
    }

    const cart = this.carts[cartId];
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex !== -1) {
      // El producto ya existe en el carrito, actualizar cantidad
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Agregar nuevo producto al carrito
      cart.items.push({ productId, quantity });
    }

    // Actualizar el total del carrito
    cart.total = cart.items.reduce((total, item) => {
      const product = productManager.getProductById(item.productId);
      return total + product.price * item.quantity;
    }, 0);

    this.saveCarts(); // Guardar cambios en el archivo
  }

  removeFromCart(cartId, productId) {
    if (!this.carts[cartId]) {
      throw new Error(`Cart with id ${cartId} not found.`);
    }

    const cart = this.carts[cartId];
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex !== -1) {
      // Eliminar el producto del carrito
      cart.items.splice(itemIndex, 1);

      // Actualizar el total del carrito
      cart.total = cart.items.reduce((total, item) => {
        const product = productManager.getProductById(item.productId);
        return total + product.price * item.quantity;
      }, 0);

      this.saveCarts(); // Guardar cambios en el archivo
    }
  }
}

// Uso de la clase ProductManager
// module.exports = new ProductManager("./JSON/products.json");
// module.exports = new CartManager("./JSON/carts.json");

const productManager = new ProductManager("./JSON/products.json");
const cartManager = new CartManager("./JSON/carts.json");

module.exports = {
  productManager,
  cartManager
}

// console.log(productManager.getProductById(3));

// const newCartId = cartManager.createCart();
// cartManager.addToCart(newCartId, 1, 2);
// cartManager.addToCart(newCartId, 2, 1);

// console.log(cartManager.getCart(1))

// Crear un carrito
// const cartId = cartManager.createCart();
// console.log(`Carrito creado con ID: ${cartId}`);

// Agregar productos al carrito
// cartManager.addToCart(cartId, 1, 2); // Agregar 2 unidades del producto con id 1 al carrito
// cartManager.addToCart(cartId, 2, 1); // Agregar 1 unidad del producto con id 2 al carrito
// console.log(`Productos agregados al carrito`);

// Ver el contenido del carrito
// const cartContents = cartManager.getCart(2);
// console.log('Contenido del carrito:', cartContents);

// Eliminar un producto del carrito
// cartManager.removeFromCart(cartId, 1); // Eliminar el producto con id 1 del carrito
// console.log('Producto eliminado del carrito');

// Ver el contenido del carrito actualizado
// const updatedCartContents = cartManager.getCart(1);
// console.log('Contenido del carrito actualizado:', updatedCartContents);