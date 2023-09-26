async function peticion() {
  try {
    const response = await fetch('http://localhost:8080/test');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la petición');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Hubo un error en la petición:', error);
  }
}