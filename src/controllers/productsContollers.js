const ProductsManager = require('../dao/Db/productsManagerDb')
// const ProductsManager = require('../dao/Fs/ProductsManager')


class ProductsController {
  constructor () {
    this.controller = new ProductsManager()
  }

  async createProduct(req, res) {
    try {
      const product = req.body;
      const requiredFields = ['name', 'description', 'code', 'price', 'stock', 'category', 'thumbnail'];
  
      const isDataValid = requiredFields.every((field) => product[field]);
      if (!isDataValid) {
        return res.status(400).json({ status: 'error', error: 'Incomplete values' });
      }

      const user = req.user; 
      let owner = 'admin';
  
      if (user) {
        if (user.role === 'premium') {
          owner = user.email; 
        } else if (user.role === 'user') {
          return res.status(403).json({ status: 'error', error: 'No tienes permisos para crear productos' });
        }
      }
  
      product.owner = owner;
      const result = await this.controller.createProduct(product);
  
      if (typeof result === 'string') {
        req.prodLogger.warning('Error al agregar el producto:', result);
        return res.status(400).json({ status: 'error', error: result });
      }
  
      return res.status(201).json({ status: 'success', message: 'Product created' });
    } catch (error) {
      req.prodLogger.error('Error al crear el producto:', error);
      return res.status(500).json({ status: 'error', error: 'Failed to create product' });
    }
  }
  
  async getAllProducts(req, res) {
    try {
      let filteredProducts = await this.controller.getAllProducts();

      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query || '';
      const category = req.query.category || '';
      const sort = req.query.sort || '';
      const available = req.query.available || '';
  
  
      // Si se proporciona un valor de consulta, aplicamos el filtro por nombre
      if (query) {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
      }
  
      // Si se proporciona una categoría, aplicamos el filtro por categoría
      if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
      }
  
      // Si se solicita ordenamiento ascendente, ordenamos por precio ascendente
      if (sort === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      }
      // Si se solicita ordenamiento descendente, ordenamos por precio descendente
      else if (sort === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      }
  
      // Si se solicita mostrar solo los disponibles, aplicamos el filtro de disponibilidad
      if (available === 'available') {
        filteredProducts = filteredProducts.filter(product => product.stock !== 0);
      }
  
      // Calcular paginación y obtener productos para la página actual
      const totalPages = Math.ceil(filteredProducts.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, filteredProducts.length);
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
      req.prodLogger.warning(error)
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  }

  async getProductById (req, res) {
    try {
      const productId = req.params.pid;
      const product = await this.controller.getProductById(productId);
  
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
      req.prodLogger.warning(error)
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  }

  async updateProductById (req, res) {
    try {
      const productId = req.params.pid;
      const updatedProduct = req.body;
      const product = await this.controller.updateProductById(productId, updatedProduct);
  
      return res.json(product);
    } catch (error) {
      req.prodLogger.warning('Error updating product:', error)
      return res.status(500).json({ status: 'error', error: 'Failed to update product' });
    }
  }

  async deleteProductById(req, res) {
    try {
      const productId = req.params.pid;
      const user = req.user;
      const product = await this.controller.getProductById(productId);
      const ownerEmail = product.owner;
  
      if (!product) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }
  
      if (user.role === 'admin' || product.owner === 'admin' || product.owner === user.email) {
        const deletedProduct = await this.controller.deleteProductById(productId);
        const productRemoveNotice = await this.controller.productRemoveNotice(ownerEmail, product);
        return res.json({ message: `El siguiente producto fue eliminado: ${deletedProduct}` });
      } else {
        return res.status(403).json({ status: 'error', error: 'No tienes permisos para borrar este producto' });
      }
    } catch (error) {
      req.prodLogger.warning('Error deleting product:', error);
      return res.status(500).json({ status: 'error', error: 'Failed to delete product' });
    }
  }
  

  async generateMockProducts(req, res) {
    try {
      const mockProducts = this.controller.generateMockProducts();
      res.json({ status: 'success', message: 'Productos ficticios generados con éxito', mockProducts });
    } catch (error) {
      req.devLogger.error('Error al generar productos ficticios');
      res.status(500).json({ status: 'error', error: 'Failed to generate mock products' });
    }
  }

}

module.exports = ProductsController;