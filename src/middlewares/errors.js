const EErrors = require('../services/err/enums');

const errorHandler = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.CREATE_CART_ERROR:
      res.send({ status: 'error', error: error.name });
      break;
    case EErrors.SAVE_CART_ERROR:
      res.send({ status: 'error', error: error.name });
      break;
    case EErrors.CART_NOT_FOUND:
      res.send({ status: 'error', error: error.name });
      break;
    case EErrors.ADD_TO_CART_ERROR:
      res.send({ status: 'error', error: error.name});
      break;
    case EErrors.UPDATING_CART_ERROR:
      res.send({ status: 'error', error: error.name });
      break;
    case EErrors.REMOVE_FROM_CART_ERROR:
      res.send({ status: 'error', error: error.name });
      break;
    case EErrors.CART_EMPTY:
      res.send({ status: 'error', error: error.name });
      break;
    default:
      res.send({ status: 'error', error: error.name });
  }
};

module.exports = errorHandler;

