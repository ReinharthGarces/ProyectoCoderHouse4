const socket = io();
socket.emit("Mi mensaje", console.log("Mensaje enviado desde cliente"))
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

const sendFormToServer = (event) => {
  event.preventDefault();

  fetch('/api/products')
    .then((response) => response.json())
    .then((data) => {
      const products = data;
      const id = products.length + 1; 
      const name = nameInput.value;
      const description = descriptionInput.value;
      const code = codeInput.value;
      const price = priceInput.value;
      const stock = stockInput.value;
      const thumbnail = thumbnailInput.value;

      console.log({ id, name, description, code, price, stock, thumbnail });

      fetch(`/api/products`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ id, name, description, code, price, stock, thumbnail }),
      }).then((response) => {
        if (response.ok) {
          socket.emit('enviarNuevoProducto', {
            id,
            name,
            description,
            code,
            price,
            stock,
            thumbnail,
          });
          form.reset();
        } else {
          console.error('Error al crear el producto');
        }
      });
    });
};

form.addEventListener("submit", sendFormToServer);

socket.on("nuevoProducto", (product) => {
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

//Elimino producto de la tabla 
const deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        const rowToDelete = document.getElementById(`deleteButton_${id}`)
          .parentNode.parentNode;
            rowToDelete.remove();
        socket.emit('eliminarProducto')
      } else {
        console.error("Error al eliminar el producto");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el producto", error);
    })
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteButton")) {
    const productId = event.target.id.split("_")[1]
    deleteProduct(productId)
  }
  // } return socket.on("productoEliminado", (id) => {
  //     console.log(id, 'productoEliminado')
  // })
});
