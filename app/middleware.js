const chalk = require('chalk');
const { logger } = require('../logger');

const logging = (req, res, next) => {
  if (req.query) {
    logger.info(chalk.bgCyan('req.query ====> '));
    logger.info(req.query);
  }
  if (req.params) {
    logger.info(chalk.bgBlue('req.params ====> '));
    logger.info(req.params);
  }
  if (req.body) {
    logger.info(chalk.bgMagenta('req.body ====> '));
    logger.info(req.body);
  }
  return next();
};

module.exports = {
  logging,
};
