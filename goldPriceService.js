const https = require("https");
const API_URL = "https://api.metalpriceapi.com/v1/latest?api_key=6797ef4b91f9d7a07ad4b9027289988f&base=INR&currencies=EUR,XAU,XAG";

async function fetchGoldPrice() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const goldPriceInINRPerTroyOunce = 1 / data.rates.XAU;
    const goldPriceInINRPerGram = goldPriceInINRPerTroyOunce / 31.1034768;
    const goldPricePerMgram = goldPriceInINRPerGram / 1000;
    return goldPricePerMgram;
  }
  catch (error) {
    if (error.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      console.error("Gold price service is not responding (timeout).");
    } else {
      console.error("Failed to fetch gold price:", error.message);
    }
    return null;
  }
}

module.exports = { fetchGoldPrice };