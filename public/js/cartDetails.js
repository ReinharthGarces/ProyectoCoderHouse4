// cartDetails.js

document.addEventListener('DOMContentLoaded', () => {
  const checkoutButton = document.getElementById('checkoutButton');
  const cartIdElement = document.querySelector('[data-cart-id]');
  const cartId = cartIdElement ? cartIdElement.dataset.cartId : null;

  if (checkoutButton && cartId) {
    checkoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const code = data.ticket['code'];
          Swal.fire('Compra exitosa', data.message, 'success').then(() => {
          window.location.href = `/${code}/purchase`;
        });
        } else {
          const data = await response.json();
          Swal.fire('Error', `Error al realizar el pago: ${data.error}`, 'error');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire('Error', 'Error al realizar el pago. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }
});
