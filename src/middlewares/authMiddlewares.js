const sessionMiddleware = (req, res, next) => {
  if (req.user) {
    return res.redirect('/profile')
  }
  return next()
}


const authorize = (roles) => {
  return (req, res, next) => {
    const user = req.user 
    
    if (!user) {
      return res.status(401).send({ error: 'No autorizado' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).send({ error: 'Acceso prohibido' });
    }
    
    next();
  };
};

module.exports = { sessionMiddleware, authorize };