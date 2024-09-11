const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const redis_url = process.env.redis_url;

const redis = new Redis(redis_url);

module.exports = { redis };
