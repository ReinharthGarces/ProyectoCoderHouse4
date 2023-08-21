const { Router } = require('express')
const fs = require('fs')
const productsRouter = Router()
const { getAllProducts, createProduct, getProductById, updateProductById, deleteProductById } = require('../dao/Db/productManagerDb')
// const ProductManager = require('../dao/Fs/ProductManager')
// const manager = new ProductManager('./src/json/products.json')


//Probando Middleware
// productsRouter.use((req, res, next) => {
//   console.log('Middleware en productsRouter')
//   return next()
// })

//Metodo GET
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || '';
    const category = req.query.category || '';
    const sort = req.query.sort || '';
    const available = req.query.available || '';

    // Obtener todos los productos
    let allProducts = await getAllProducts();

    // Aplicar filtros y ordenamiento
    let filteredProducts = allProducts;

    // Filtro por nombre (query)
    if (query) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    }
    
    // Filtro por categoría
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Ordenamiento por precio
    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Filtro por disponibilidad
    if (available === 'available') {
      filteredProducts = filteredProducts.filter(product => product.stock !== 0);
    }
    
    // Calcular paginación
    const totalPages = Math.ceil(filteredProducts.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, filteredProducts.length);

    // Obtener productos para la página actual
    const limitedProducts = filteredProducts.slice(startIndex, endIndex);

    // Construir enlaces de paginación
    const prevLink = page > 1 ? `/productos?page=${page - 1}&limit=${limit}` : null;
    const nextLink = page < totalPages ? `/productos?page=${page + 1}&limit=${limit}` : null;

    // Construir objeto de respuesta con información de paginación
    const response = {
      status: 'success',
      payload: limitedProducts,
      pagination: {
        totalPages: totalPages,
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: prevLink,
        nextLink: nextLink
      }
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



