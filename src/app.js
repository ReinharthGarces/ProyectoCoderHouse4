const express = require ('express')

const app = express()

app.use(express.urlencoded({extended:true}))


app.get('/saludo/:name', ( req,res ) =>{
  console.log(req.params)
  return res.send(`Hola desde express ${req.params.name}`)
})

app.listen(8080, () =>{
  console.log('Servidor arriba desde puerto 8080')
})

console.log('hola como estas')

// app.get('/users/:userId', async ( req, res) =>{
//   const userId = parseInt(req.params.userId)
//   const user = user.find( user => user.id === userId )

//     if(!user) return res.send({error: 'Usuario no encontrado'})

//     res.send({user})
// })
