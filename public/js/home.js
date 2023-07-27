console.log('Test home.js')

// Conectar al servidor Socket.IO
const socket = io();

// Escuchar el evento 'nuevoProducto'
socket.on('nuevoProducto', (product) => {
  // Agregar el nuevo producto a la tabla de productos en la página "home"
  const tableBody = document.querySelector("#productos");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td><button class="deleteButton" id="deleteButton_${product.id}" onclick="deleteProduct(${product.id})">Borrar</button></td>
  `;
  tableBody.appendChild(newRow);
});