const winston = require('winston');

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
    http: 5,
    warn: 6,
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    debug: 'white',
    http: 'green',
    warn: 'magenta',
  },
};

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevelsOptions.colors }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({ level: 'http' }),
    new winston.transports.File({
      filename: 'logs/warns.log',
      level: 'warning',
    }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  // req.logger.fatal(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`);
  next();
};

module.exports = addLogger;
