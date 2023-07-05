const express = require ('express')
const ProductManager = require ('./ProductManager')
const manager = new ProductManager('./products.json')

const app = express()
const server = app.listen(8080, () =>console.log('Servidor arriba desde puerto 8080'))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
// app.use('/api/users/', usersRouter)
// app.use('/api/pets/', petsRouter)



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


//Metodo POST
let users = []

app.post('/api/user', (req, res) => {
  let user = req.body
  
  if(!user.firstName || !user.lastName) {
    return res.status(400).send ({status: "error", error: "Incomplete values"})
  }

  users.push(user)
  res.send({status: "succes", message: "User Created"})
  console.log(user)
})

//Metodo DELETE

app.delete('/api/user/:name', (req,res) =>{
  let name = req.params.name
  let currentLength = users.length
  console.log(users)
  users = users.filter( user=>user.firstName!=name )
  if(users.lenght===currentLength){
    return res.status(404).send({status:"error", error: "User not found"})
  }
  res.send({status:"success", message: "User deleted"})
})








