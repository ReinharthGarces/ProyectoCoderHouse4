// products.js
document.addEventListener('DOMContentLoaded', () => {
  const aggCarritoForm = document.getElementById('aggCarrito');
  aggCarritoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const productId = aggCarritoForm.querySelector('[name="productId"]').value;

    try {
      const response = await fetch('/api/carts/', {
        method: 'POST',
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
      
      if (response.ok) {
        const cartId = await response.json();
        console.log('cartId', cartId);
        console.log('productId', productId);

        const responsePut = await fetch(`/api/carts/${cartId}`, {
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

        if (responsePut.ok) {
          console.log('Producto agregado al carrito');
          window.location.href = `/carts/${cartId}`;
        } else {
          console.error('Error al agregar producto al carrito');
        }
      } else {
        console.error('Error al crear el carrito y agregar producto');
      }
    } catch (error) {
      console.error('Error al crear el carrito y agregar producto', error);
    }
  });
});
