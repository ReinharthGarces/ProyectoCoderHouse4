const ProductManager = require('../manager/ProductManager')
const manager = new ProductManager('./src/json/products.json')

const socket = io()
console.log(socket)

socket.emit('Mi mensaje', 'Mensaje enviado desde cliente')
socket.on('Mensaje Back-end', (data) => {
  console.log(data)
})

// Capturamos el formulario y sus campos
const form = document.querySelector('form');
const nameInput = document.getElementById('nameInput');
const descriptionInput = document.getElementById('descriptionInput');
const codeInput = document.getElementById('codeInput');
const priceInput = document.getElementById('priceInput');
const stockInput = document.getElementById('stockInput');
const thumbnailInput = document.getElementById('thumbnailInput');

// Función para enviar el formulario al servidor
const sendFormToServer = async (event) => {
  event.preventDefault()
  const products = await manager.getProducts()
  const addProducts = await manager.addProducts()

  const id = products.length +1
  const name = nameInput.value;
  const description = descriptionInput.value;
  const code = codeInput.value;
  const price = priceInput.value;
  const stock = stockInput.value;
  const thumbnail = thumbnailInput.value;


  console.log({ name, description, code, price, stock, thumbnail });

  // Emitimos el evento 'enviarNuevoProducto' con los datos del nuevo producto al servidor
  socket.emit('enviarNuevoProducto', { name, description, code, price, stock, thumbnail });

  // Limpia los campos del formulario después de enviarlo
  form.reset();
};

// Asociamos la función sendFormToServer al evento submit del formulario
form.addEventListener('submit', sendFormToServer);

// Escuchamos el evento 'nuevoProducto' del servidor y agregamos el nuevo producto a la tabla
socket.on('nuevoProducto', (product) => {
  const tableBody = document.querySelector("#productos");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td>${product.thumbnail}</td>
    <td><button class="deleteButton" id="deleteButton_${product.id}" onclick="deleteProduct(${product.id})">Borrar</button></td>
  `;
  tableBody.appendChild(newRow);
});

// Función para eliminar un producto (si es necesario, puede ser implementada)
// Función para eliminar un producto
const deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.ok) {
      // Si la eliminación fue exitosa, eliminamos la fila correspondiente en la tabla
      const rowToDelete = document.getElementById(`deleteButton_${id}`).parentNode.parentNode;
      rowToDelete.remove();
    } else {
      // Si hubo un error al eliminar el producto, muestra un mensaje de error
      console.error('Error al eliminar el producto');
    }
  }).catch((error) => {
    console.error('Error al eliminar el producto', error);
  });
};

// Escuchamos el evento click en los botones "Delete"
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('deleteButton')) {
    const productId = event.target.id.split('_')[1];
    deleteProduct(productId);
  }
});
