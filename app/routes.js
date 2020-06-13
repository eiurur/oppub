const { DLSite } = require('mizu');
const redisClient = require('./model');
const { validate, takeRandom, querystring } = require('./util');
const { logging } = require('./middleware');
const { logger } = require('../logger');

module.exports = (app) => {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.get('/ranking', [logging], async (req, res) => {
    try {
      validate(req.query);

      const { term, range, type, category, sub, aid, count = 4 } = req.query;

      const key = querystring({
        term,
        type,
        category,
        range,
        sub,
        aid,
      });
      const cache = await redisClient.getAsync(key);
      if (cache) {
        logger.info('cache');
        const works = JSON.parse(cache);
        if (Array.isArray(works) && works.length) {
          return res.send(takeRandom(works, count));
        }
      }

      const initial = { term };
      const options = {
        type,
        category,
        range,
        sub,
        affiliateId: aid,
        limit: 100,
      };
      const servive = new DLSite(initial);
      const works = await servive.scrape({
        amount: -1,
        options,
      });
      await redisClient.set(key, JSON.stringify(works));

      res.send(takeRandom(works, count));
    } catch (err) {
      logger.info(err);
      res.status(400).send(err.toString());
    }
  });

  app.get('*', (req, res) => {
    res.status(404).send('Not Found');
  });
};
