const socket = io();

socket.on("Mensaje Back-end", (data) => {
  console.log(data);
});

const form = document.querySelector("form");
const nameInput = document.getElementById("nameInput");
const descriptionInput = document.getElementById("descriptionInput");
const codeInput = document.getElementById("codeInput");
const priceInput = document.getElementById("priceInput");
const stockInput = document.getElementById("stockInput");
const thumbnailInput = document.getElementById("thumbnailInput");

const sendFormToServer = async (event) => {
  event.preventDefault();

  try {
    const newProduct = {
      name: nameInput.value,
      description: descriptionInput.value,
      code: codeInput.value,
      price: priceInput.value,
      stock: stockInput.value,
      thumbnail: thumbnailInput.value,
    };

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const productData = await response.json();
      socket.emit('enviarNuevoProducto', productData);
      console.log('Producto creado en el servidor:', productData);
      form.reset();
    } else {
      console.error('Error al crear el producto');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

form.addEventListener("submit", sendFormToServer);

socket.on("nuevoProducto", (product) => {
  console.log('Nuevo producto recibido en el servidor:', product);
  const tableBody = document.querySelector("#productos");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${product._id}</td>
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td>${product.thumbnail}</td>
    <td><button class="deleteButton" id="deleteButton_${product._id}" onclick="deleteProduct('${product._id}')">Borrar</button></td>
  `;
  tableBody.appendChild(newRow);
});

async function deleteProduct(productId) {
  try {
    const deleteResponse = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (deleteResponse.ok) {
      const deleteButton = document.getElementById(`deleteButton_${productId}`);
      deleteButton.closest('tr').remove();
      socket.emit('eliminarProducto');
    } else {
      console.error('Error al borrar el producto');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

