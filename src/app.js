const express = require ('express')
const productsRouter = require('./routes/products')
// const cartsRouter = require('./routes/carts')



const app = express()
const server = app.listen(8080, () =>console.log('Servidor arriba desde puerto 8080'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static('public'))
app.use('/api/products', productsRouter)
// app.use('/api/carts', cartsRouter)
app.use((req, res, next) => {
  console.log('Middleare a nivel aplicación')
  return next()
})



//Metodo DELETE
// app.delete('/api/user/:name', (req,res) =>{
//   let name = req.params.name
//   let currentLength = users.length
//   console.log(users)
//   users = users.filter( user=>user.firstName!=name )
//   if(users.lenght===currentLength){
//     return res.status(404).send({status:"error", error: "User not found"})
//   }
//   res.send({status:"success", message: "User deleted"})
// })








