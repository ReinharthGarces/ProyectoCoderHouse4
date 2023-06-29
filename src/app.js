const express = require ('express')
const ProductManager = require ('./ProductManager')

const manager = new ProductManager('./products.json')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await manager.getProducts() 

    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, parseInt(limit))
      console.log(limitedProducts)
      return res.json(limitedProducts)
    }

    res.json(products) 
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)

    const product = await manager.getProductsById(productId)

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})


app.listen(8080, () =>{
  console.log('Servidor arriba desde puerto 8080')
})



