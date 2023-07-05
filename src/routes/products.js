const { Router } = require('express')
const uploader = require('../utils/utils')

const productsRouter = Router()
const products = []


productsRouter.use((req,res,next) =>{
  console.log('Middleware en productsRouter')
  return next()
})

productsRouter.get('/', async (req, res) => {
  
})


// router.get('/', (req,res) => {
  
// })

// export default router;