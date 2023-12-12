document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        name: registerForm.elements.name.value,
        lastname: registerForm.elements.lastname.value,
        email: registerForm.elements.email.value,
        age: registerForm.elements.age.value,
        password: registerForm.elements.password.value,
      };

      try {
        const response = await fetch('/api/session/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          Swal.fire('Registro exitoso', '¡Te has registrado con éxito!', 'success')
            .then(() => {
              window.location.href = '/login';
            });
        } else {
          const data = await response.json();
          Swal.fire('Error', `Error al registrar: ${data.error}`, 'error');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire('Error', 'Error al registrar. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }
});
