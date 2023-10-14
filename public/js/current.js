//Current.js

// async function getTokenFromCookie() {
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.trim().split('=');
//     if (cookieName === 'token') {
//       console.log(decodeURIComponent(cookieValue));
//       return decodeURIComponent(cookieValue);
//     }
//   }
//   return null;
// }

// async function fetchDataWithToken() {
//   try {
//     const token = await getTokenFromCookie();
//     console.log(token);

//     if (token) {
//       console.log('Token JWT desde la cookie:', token);

//       const requestOptions = {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           Authorization: `Bearer ${token}`, 
//         },
//       };

//       const response = await fetch('/current', requestOptions);
//       if (!response.ok) {
//         throw new Error('Error al obtener la información del usuario');
//       }

//       const data = await response.json();
//       console.log('Información del usuario:', data);
//     } else {
//       console.log('Token no encontrado en las cookies.');
//     }
//   } catch (error) {
//     console.error('Error al obtener la información del usuario:', error);
//   }
// }

// fetchDataWithToken();
