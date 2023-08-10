const { Router } = require('express')
const fs = require('fs')
const productsRouter = Router()
const ProductManager = require('../dao/Fs/ProductManager')
const { getAllProducts, createProduct, getProductById, updateProductById, deleteProductById } = require('../dao/Db/productManagerDb')
const manager = new ProductManager('./src/json/products.json')

//Probando Middleware
productsRouter.use((req, res, next) => {
  console.log('Middleware en productsRouter')
  return next()
})

//Metodo GET
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    console.log(limit);
// const products = await manager.getProducts() (fs)
    const result = await getAllProducts();

    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = result.slice(0, parseInt(limit));
      console.log(limitedProducts);
      return res.json(limitedProducts);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

//Metodo GET/:pid
productsRouter.get('/:pid', async (req, res) => {
  try {
  // const productId = parseInt(req.params.pid)
  // const product = await manager.getProductsById(productId) (fs)
    const productId = req.params.pid
    const product = await getProductById(productId)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})

//Metodo POST
productsRouter.post('/', async (req, res) => {
  try {
    const product = req.body;
    const requiredFields = ['name', 'description', 'code', 'price', 'stock', 'thumbnail'];

    const isDataValid = requiredFields.every((field) => product[field]);
    if (!isDataValid) {
      return res.status(400).json({ status: 'error', error: 'Incomplete values' });
    }

// const result = await manager.addProduct(product.name, product.description,...) (fs) 
    const result = await createProduct(product);
    if (typeof result === 'string') {
      console.error('Error al agregar el producto:', result);
      return res.status(400).json({ status: 'error', error: result });
    }

    return res.status(201).json({ status: 'success', message: 'Product created' });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    return res.status(500).json({ status: 'error', error: 'Failed to create product' });
  }
});

// //Metodo PUT
productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
// manager.updateProduct(product.id, data) (fs)
    const product = await updateProductById(productId, updatedProduct);

    return res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ status: 'error', error: 'Failed to update product' });
  }
});



//Metodo DELETE
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
// manager.deleteProduct(productId) (fs)
    const product = await deleteProductById(productId)
    return res.json({ message: `El siguiente producto fue eliminado: ${product}` });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ status: 'error', error: 'Failed to delete product' });
  }
});


module.exports = productsRouter