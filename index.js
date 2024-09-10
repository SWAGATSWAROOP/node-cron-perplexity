const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cron = require("node-cron");
const { getNewsChat, getChatSession } = require("./on-demand/chat.js");
const { getRedisCache, setRedisCache } = require("./redis/cache.js");
const { redis } = require("./redis/redis.js");

const app = express();

// cron.schedule
cron.schedule("0 * * * *", async () => {
  try {
    const answer = await getNewsChat();
    console.log("Got answer");
    await setRedisCache(answer);
  } catch (error) {
    console.log("Failed to get answer ", error.message);
  }
});

//To refresh chat session
cron.schedule("40 0 * * *", async () => {
  try {
    const createChatSession = await getChatSession();
    console.log("Successfully genrated session id");
    await redis.set("sessionid", createChatSession);
    console.log("Successfully saved session id to redis");
  } catch (error) {
    console.log("Failed the cron job ", error.message);
  }
});

app.get("/getnews", async (_, res) => {
  try {
    const response = await getRedisCache();
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedResponse);
    return res
      .status(200)
      .json({ data: jsonResponse, message: "Data sent Successfully" });
  } catch (error) {
    console.log(error.message);
    return response
      .status(500)
      .json({ data: "", message: "Unable to process" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
