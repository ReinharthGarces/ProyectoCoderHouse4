//restore_password.js

document.addEventListener('DOMContentLoaded', function () {
  const tokenInput = document.querySelector('input[name="token"]');

  if (tokenInput) {
    const token = tokenInput.value;
    console.log('Token:', token);
  } else {
    console.error('Elemento de token no encontrado');
  }
});
