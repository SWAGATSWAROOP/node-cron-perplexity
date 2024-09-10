const { redis } = require("./redis");

const setRedisCache = async (text) => {
  try {
    await redis.set("query", text);
    console.log("Successfully saved to Redis");
  } catch (error) {
    console.log("Failed to save to Redis");
  }
};

const getRedisCache = async () => {
  try {
    const data = await redis.get("query");
    console.log("Able to received cache ", data);
    return data;
  } catch (error) {
    console.log("Failed to receive cache ", error.message);
    return "";
  }
};

module.exports = { setRedisCache, getRedisCache };
