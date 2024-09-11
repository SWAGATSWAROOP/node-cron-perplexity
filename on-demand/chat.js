const axios = require("axios");
const { redis } = require("../redis/redis.js");
const dotenv = require("dotenv");
dotenv.config();

const ondemand_api_key = process.env.ondemand_api_key;

async function getChatSession() {
  const options = {
    method: "POST",
    url: "https://api.on-demand.io/chat/v1/sessions",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: ondemand_api_key,
    },
    data: { externalUserId: "HackBrokers", pluginIds: ["plugin-1722260873"] },
  };

  const response = await axios(options);
  console.log(response.data?.message);
  return response?.data?.id;
}

const getNewsChat = async () => {
  const sessionid = await redis.get("sessionid");

  const options = {
    method: "POST",
    url: `https://api.on-demand.io/chat/v1/sessions/${sessionid}/query`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: ondemand_api_key,
    },
    data: {
      responseMode: "sync",
      query: "Give 5 postive news in the Middle East Region",
      pluginIds: ["plugin-1722260873"],
      onlyFulfillment: true,
      modelConfigs: {
        fulfillmentPrompt:
          "Question: {question} and Context: {context} Give me brief answer, images and source urls of the query in json format having key answer,image,source",
      },
      endpointId: "predefined-openai-gpt4o",
    },
  };

  const response = await axios(options);
  console.log(response.data);
  return response.data?.data?.answer;
};

module.exports = { getChatSession, getNewsChat };
