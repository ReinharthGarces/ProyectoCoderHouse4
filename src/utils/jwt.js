const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  try {
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    return token;
  } catch (error) {
    throw new Error('Error al generar el token');
  }
};

const authToken = (req, res, next) => {
  try {
    const authToken = req.cookies.tokenJwt;

    if (!authToken) {
      return res.status(401).send({ error: 'Token no proporcionado' });
    }

    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (error, credentials) => {
      if (error) {
        return res.status(401).send({ error: 'Token no válido' });
      }

      req.user = credentials.user;
      next();
    });
  } catch (error) {
    return res.status(500).send({ error: 'Error en la autenticación' });
  }
};

module.exports = { generateToken, authToken };
