document.addEventListener('DOMContentLoaded', () => {
  const aggCarritoForms = document.getElementsByClassName('aggCarritoForm');

  // Itera sobre cada formulario en la colección
  for (const aggCarritoForm of aggCarritoForms) {
    aggCarritoForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const productId = aggCarritoForm.querySelector('[name="productId"]').value;
      const userCart = aggCarritoForm.getAttribute('data-user-cart');
      console.log(userCart);

      try {
        const getCartResponse = await fetch(`/api/carts/${userCart}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!getCartResponse.ok) {
          const errorData = await getCartResponse.json(); 
          console.error('Error al buscar el carrito existente:', errorData);
          return;
        }

        const putCartResponse = await fetch(`/api/carts/${userCart}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            products: [{
              productId: productId,
              quantity: 1
            }]
          })
        });

        if (putCartResponse.ok) {
          console.log('Producto agregado al carrito');
          window.location.href = `/carts/${userCart}`;
        } else {
          console.error('Error al agregar producto al carrito');
        }
      } catch (error) {
        console.error('Error al agregar producto al carrito', error);
      }
    });
  }
});
