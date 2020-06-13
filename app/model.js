const bluebird = require('bluebird');
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const redisClient = redis.createClient({
  url: REDIS_URL,
  no_ready_check: true,
});

redisClient.auth(REDIS_PASSWORD, (err) => {
  if (err) throw err;
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = redisClient;
