const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

module.exports = () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(cors({ origin: '*' }));
  app.set('port', process.env.PORT || 11081);
  app.use(compression({ level: 9 }));
  app.use(helmet());
  return app;
};
