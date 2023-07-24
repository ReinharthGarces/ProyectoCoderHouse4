
const socket = io()
console.log(socket)

socket.emit('Mi mensaje', 'Mensaje enviado desde cliente')
socket.on('Mensaje Back-end', (data) => {
  console.log(data)
})

// const formButton = document.getElementById('formButton')
// const nameInput = document.getElementById('nameInput')
// const descriptionInput = document.getElementById('descriptionInput')
// const codeInput = document.getElementById('codeInput')
// const priceInput = document.getElementById('priceInput')
// const stockInput = document.getElementById('stockInput')
// const thumbnailInput = document.getElementById('thumbnailInput')



// formButton.addEventListener('submit', (event) => {
//   event.preventDefault()

//   const name = nameInput.value
//   const description = descriptionInput.value
//   const code = codeInput.value
//   const price = priceInput.value
//   const stock = stockInput.value
//   const thumbnail = thumbnailInput.value

//   console.log({ name, description, code, price, stock, thumbnail })

//   socketServer.emit('enviarNuevoProducto', JSON.stringify({ name, description, code, price, stock, thumbnail }))
// })


// //elimino producto
// const deleteProduct = (id) => {
//   fetch(`/api/products/${id}`, {
//     method: 'DELETE',
//   })
// }


// //Creo nuevo producto
// socketServer.on('nuevoProducto', (data) => {
//   const product = JSON.parse(data)

//   const productHTML = `
//   <tr>
//       <td>${this.id}</td>
//       <td>${this.title}</td>
//       <td>${this.description}</td>
//       <td>${this.code}</td>
//       <td>${this.price}</td>
//       <td>${this.stock}</td>
//       <td>${this.thumbnail}</td>
//   </tr>
//   `

//   const table = document.getElementById('productos')

//   table.innerHTML += productHTML
// })
