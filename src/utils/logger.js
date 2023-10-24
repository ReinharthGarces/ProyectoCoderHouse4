const winston = require('winston');

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'black',
    warning: 'yellow',
    info: 'blue',
    http: 'green',
    debug: 'white',
  },
};

//Logger de desarrollo
const developmentLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevelsOptions.colors }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({ level: 'debug' }),
  ],
});

const devLogger = (req, res, next) => {
  req.devLogger = developmentLogger;
  next();
};

//Logger de produccion
const productionLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevelsOptions.colors }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
  ],
});

const prodLogger = (req, res, next) => {
  req.prodLogger = productionLogger;
  next();
};

module.exports = {
  devLogger,
  prodLogger,
};

