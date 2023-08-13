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
const caregoryInput = document.getElementById("categoryInput");
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
      category: caregoryInput.value,
      thumbnail: thumbnailInput.value,
    };
    console.log(newProduct)

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
      socket.emit('enviarNuevoProducto', newProduct);
      console.log('Producto creado en el servidor:', JSON.stringify(productData, null, 2));
      form.reset();
      location.reload();
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
    <td>${product.category}</td>
    <td>${product.thumbnail}</td>
    <td><button class="deleteButton" id="${product._id}">Borrar</button></td>
  `;
  tableBody.appendChild(newRow);
})

//Elimino producto de la tabla 
async function deleteProduct (productId) {
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  })
  .then((response) => {
    if (response.ok) {
      const rowToDelete = document.getElementById(productId)
        .parentNode.parentNode;
      rowToDelete.remove();
      socket.on('productoEliminado', productId)
    } else {
      console.error("Error al eliminar el producto");
    }
  })
  .catch((error) => {
    console.error("Error al eliminar el producto", error);
  });
};

document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("deleteButton")) {
    const productId = event.target.getAttribute('id');
    socket.emit('eliminarProducto', productId);
    await deleteProduct(productId);
  }
}); 


