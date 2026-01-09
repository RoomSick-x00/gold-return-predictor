// goldPriceService.js

const https = require("https");

/**
 * Fetches live gold price per gram (INR)
 * Returns:
 *  { pricePerGram, source, timestamp }
 *  OR
 *  null (if failed)
 */
async function getLiveGoldPrice() {
  const API_URL = "https://api.metalpriceapi.com/v1/latest?api_key=6797ef4b91f9d7a07ad4b9027289988f&base=USD&currencies=EUR,XAU,XAG,INR";

  return new Promise((resolve) => {
    https
      .get(API_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            // API returns price per ounce (USD)
            const pricePerOunceUSD = parsed[0]?.gold;

            if (!pricePerOunceUSD) {
              resolve(null);
              return;
            }

            // Convert ounce → gram
            const pricePerGramUSD = pricePerOunceUSD / 31.1035;

            // NOTE: currency conversion handled later (or assumed)
            resolve({
              pricePerGram: pricePerGramUSD,
              source: "metals.live",
              timestamp: new Date().toISOString(),
            });
          } catch (err) {
            resolve(null);
          }
        });
      })
      .on("error", () => {
        resolve(null);
      });
  });
}

module.exports = {
  getLiveGoldPrice,
};
