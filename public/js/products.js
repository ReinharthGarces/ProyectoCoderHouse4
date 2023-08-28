// products.js
document.addEventListener("DOMContentLoaded", () => {
  async function addToCart(productId) {
    try {
      let cartId = localStorage.getItem("cartId");

      if (!cartId) {
        const response = await fetch("/carts", {
          method: "POST"
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("responseData", responseData)
          cartId = responseData.cartId;
          localStorage.setItem("cartId", cartId);
          alert("Carrito creado exitosamente");
        } else {
          alert("Hubo un problema al crear el carrito");
          return;
        }
      }

      console.log("cartId", cartId)
      console.log("productId", productId)
      const response = await fetch(`/carts/${cartId}/products/${productId}`, {
        method: "POST"
      });

      if (response.ok) {
        alert("Producto agregado al carrito exitosamente");
      } else {
        alert("Hubo un problema al agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito", error);
    }
  }

  window.addToCart = addToCart;
});

console.log(user)