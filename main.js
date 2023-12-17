class ProductManager {
    constructor() {
      this.products = [];
      this.lastProductId = 0;
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (!product) {
        throw new Error(`Product with id ${productId} not found.`);
      }
      return product;
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
      return newProduct;
    }
  }
  
  // Crear instancia de ProductManager
  const productManager = new ProductManager();
  
  // Llamar a getProducts (debe devolver un arreglo vacío)
  console.log(productManager.getProducts()); // []
  
  // Llamar a addProduct con nuevos campos
  const newProduct = productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    image: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
  
  // Llamar a getProducts nuevamente (debe aparecer el producto recién agregado)
  console.log(productManager.getProducts()); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 } ]
  
  // Intentar agregar el mismo producto (debe arrojar un error)
  try {
    productManager.addProduct({
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      image: "Sin imagen",
      code: "abc123",
      stock: 25,
    });
  } catch (error) {
    console.error(error.message); // Product with code abc123 already exists.
  }
  
  // Evaluar getProductById
  try {
    const retrievedProduct = productManager.getProductById(1);
    console.log(retrievedProduct); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }
  } catch (error) {
    console.error(error.message);
  }
  