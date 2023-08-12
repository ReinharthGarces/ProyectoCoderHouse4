// Conectar al servidor Socket.IO
const socket = io();

// Función para agregar una nueva fila de producto a la tabla
function agregarFilaProducto(product) {
  const tableBody = document.querySelector("#productos");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${product._id}</td>
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
  `;
  tableBody.appendChild(newRow);
}

// Función para eliminar una fila de producto de la tabla
function eliminarFilaProducto(productId) {
  const tableBody = document.querySelector("#productos");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const idCell = row.getElementsByTagName("td")[0];

    if (idCell && row.id === productId) {
      console.log(row.id)
      tableBody.removeChild(row.id);
    }
  }
};

// Escuchar el evento para agregar un nuevo producto
socket.on('nuevoProducto', (product) => {
  console.log(product);
  agregarFilaProducto(product);
  location.reload();
});

// Escuchar el evento para eliminar un producto
socket.on('productoEliminado', (productId) => {
  console.log('Producto eliminado en el evento:', productId);
  eliminarFilaProducto(productId);
});