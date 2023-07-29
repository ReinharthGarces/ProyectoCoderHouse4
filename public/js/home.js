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
  `;
  tableBody.appendChild(newRow);
})

// Agregar el evento para eliminar producto
socket.on('eliminarProducto', (productId) => {
  const tableBody = document.querySelector("#productos")
  const rows = tableBody.getElementsByTagName("tr")

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const idCell = row.getElementsByTagName("td")[0]
    const id = idCell.textContent

    if (id === productId) {
      tableBody.removeChild(row)
      break
    }
  }
});
