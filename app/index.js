const cluster = require('cluster');
const createListener = require('./express');
const createServer = require('./server');
const numCPUs = require('os').cpus().length;

const { logger } = require('../logger');

/**
 * Application
 */
const listener = createListener();

/**
 * routes
 */
require('./routes')(listener);

/**
 * Server
 */
if (process.env.NODE_ENV === 'production' && cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const server = createServer(listener);
  server.listen(listener.get('port'), () => {
    logger.info(
      `Express HTTPS server listening on port ${listener.get('port')}`,
    );
  });
}
