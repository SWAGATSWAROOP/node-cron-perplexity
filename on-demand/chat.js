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
      query:
        "Provide 5 positive business and technology news updates from the Middle East.",
      pluginIds: ["plugin-1722260873"],
      onlyFulfillment: true,
      modelConfigs: {
        fulfillmentPrompt:
          "Question: {question} and Context: {context} Provide the answer in JSON format with image_url,source_url,and title for each news item, all in an array. Ensure all URLs are unique and real.",
      },
      endpointId: "predefined-openai-gpt4o",
    },
  };

  const response = await axios(options);
  console.log(response.data);
  return response.data?.data?.answer;
};

module.exports = { getChatSession, getNewsChat };
