// faillogin.js
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');

  if (errorParam === 'invalid_credentials') {
    Swal.fire({
      icon: 'error',
      title: 'Error de inicio de sesión',
      text: 'Nombre de usuario o contraseña inválidos.',
      confirmButtonText: 'Intentar de nuevo',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/login'; 
      }
    });
  }
});
