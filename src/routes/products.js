const { Router } = require('express')
const fs = require('fs')
const productsRouter = Router()
// const ProductManager = require('../dao/Fs/ProductManager')
// const manager = new ProductManager('./src/json/products.json')
const { getAllProducts, createProduct, getProductById, updateProductById, deleteProductById } = require('../dao/Db/productManagerDb')

//Probando Middleware
productsRouter.use((req, res, next) => {
  console.log('Middleware en productsRouter')
  return next()
})

//Metodo GET
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || '';
    const category = req.query.category || '';
    const sort = req.query.sort || '';
    const available = req.query.available || '';

    let result = await getAllProducts();

     // Aplicar filtro por query (si se proporciona)
    if (query) {
      result = result.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    }
    
    // Aplicar filtro por categoría (si se proporciona)
    if (category) {
      result = result.filter(product => product.category === category);
    }

    // Aplicar ordenamiento por sort (si se proporciona)
    if (sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    // Aplicar filtro por disponibilidad (si se proporciona) - Cambio aquí
    if (available === 'available') {
      result = result.filter(product => product.stock !== 0);
    }
    
    // Calcular total de páginas y definir índices para paginación
    const totalPages = Math.ceil(result.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Obtener los productos para la página actual
    const limitedProducts = result.slice(startIndex, endIndex);

    const response = {
      status: 'success',
      payload: limitedProducts,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/productos?page=${page - 1}&limit=${limit}` : null,
      nextLink: page < totalPages ? `/productos?page=${page + 1}&limit=${limit}` : null
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


//Metodo GET/:pid y confirmando si hay stock!
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const isAvailable = product.stock > 0;
    const response = {
      available: isAvailable,
      product: product
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});


//Metodo POST
productsRouter.post('/', async (req, res) => {
  try {
    const product = req.body;
    const requiredFields = ['name', 'description', 'code', 'price', 'stock', 'category', 'thumbnail'];

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
    const productId = req.params.pid
// manager.deleteProduct(productId) (fs)
    const product = await deleteProductById(productId)
    return res.json({ message: `El siguiente producto fue eliminado: ${product}` });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ status: 'error', error: 'Failed to delete product' });
  }
});


module.exports = productsRouter



