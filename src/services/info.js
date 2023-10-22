// generateErrorInfo.js
const generateUserErrorInfo = (user) => {
  return `
  One or more properties were incomplete or not valid
  List of properties:
  * first_name: needs to be a String, received ${user.first_name}
  * last_name: needs to be a String, received ${user.last_name}
  * email: needs to be a String, received ${user.email}`;
};

const generateCartErrorInfo = (cartId) => {
  if (!cartId) {
    return 'No se proporcionó un ID de carrito';
  } else {
    return `El ID de carrito '${cartId}' no existe en la base de datos`;
  }
};


module.exports = {
  generateUserErrorInfo,
  generateCartErrorInfo,
};
