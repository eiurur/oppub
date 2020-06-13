const moment = require('moment');
const { DLSite } = require('mizu');
const redisClient = require('./model');
const { validate, takeRandom, querystring } = require('./util');
const { logger } = require('../logger');

module.exports = (app) => {
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.get('/ranking', async (req, res) => {
    try {
      validate(req.query);

      const {
        term,
        range,
        type,
        category,
        sub,
        aid = 'kawpaa',
        count = 4,
      } = req.query;

      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      const key = querystring({
        date: yesterday,
        term,
        type,
        category,
        range,
        sub,
      });
      const ls = await redisClient.getAsync(key);
      if (ls) {
        logger.info('cache');
        const list = JSON.parse(ls);
        if (Array.isArray(list) && list.length) {
          return res.send(takeRandom(list, count));
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
      const result = await servive.scrape({
        amount: -1,
        options,
      });
      await redisClient.set(key, JSON.stringify(result));

      res.send(takeRandom(result, count));
    } catch (err) {
      logger.info(err);
      res.status(400).send(err.toString());
    }
  });

  app.get('*', (req, res) => {
    res.status(404).send('Not Found');
  });
};
