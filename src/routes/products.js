const { Router } = require('express')


const productsRouter = Router()
let products = []


productsRouter.use((req,res,next) =>{
  console.log('Middleware en productsRouter')
  return next()
})

// productsRouter.get('/api/products', async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit)
//     const products = await manager.getProducts() 

//     if (!isNaN(limit) && limit > 0) {
//       const limitedProducts = products.slice(0, parseInt(limit))
//       console.log(limitedProducts)
//       return res.json(limitedProducts)
//     }

//     res.json(products) 
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Error al obtener los productos' })
//   }
// })

// productsRouter.get('/api/products/:pid', async (req, res) => {
//   try {
//     const productId = parseInt(req.params.pid)

//     const product = await manager.getProductsById(productId)

//     if (!product) {
//       return res.status(404).json({ error: 'Producto no encontrado' })
//     }

//     res.json(product)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Error al obtener el producto' })
//   }
// })


//Metodo POST
productsRouter.post('/', (req, res) => {
  const product = req.body

  if(!product || Object.values(product).some(value => !value)){
    return res.status(400).send({status: "error", error: "Incomplete values"})
  }

  product.id = products.length + 1
  products.push(product)
  console.log(products)
  return res.status(201).json({status: "success",  message:"Product created" })
})

module.exports = productsRouter