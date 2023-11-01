// En recovery_password.js
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  console.log(email);

  try {
    const response = await fetch('/api/session/recovery_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado con éxito',
        text: 'Revisa tu casilla de mail y restablece tu contraseña desde el link enviado.',
      })
      .then(() => {
        window.location.href = '/login';
      });

    } else {
      const data = await response.json();
      Swal.fire('Error', data.error, 'error');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
  }
});
