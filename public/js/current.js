//Current.js
// Primero, realiza una solicitud para obtener el token JWT (asumiendo que la ruta es /api/auth/token)
fetch('/api/session/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  },
  body: JSON.stringify({
    email: 'bianz@gmail.com',
    password: 'qwerty'
  }),
})
  .then(response => response.json())
  .then(data => {
    const token = data.token;

// Luego, realiza una segunda solicitud para obtener la información del usuario utilizando el token JWT
    fetch('/api/session/current', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(user => {
        console.log('Información del usuario:', user);
      })
      .catch(error => {
        console.error('Error al obtener la información del usuario:', error);
      });
  })
  .catch(error => {
    console.error('Error al obtener el token JWT:', error);
  });
