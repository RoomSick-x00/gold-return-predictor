const https = require("https");
const API_KEY = process.env.METAL_API_KEY;
const API_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=INR&currencies=EUR,XAU,XAG`;
if (!API_KEY) {
    throw new Error("METAL_API_KEY not set in environment");
}

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
    saveCache(goldPricePerMgram);
    return goldPricePerMgram;
  }
  catch (error) {
    console.error("Live fetch failed, trying cache...");
    const cachedPrice = readCache();
    if (cachedPrice !== null) {
        console.log("Using cached gold price.");
        return cachedPrice;
    }
    return null;
  }
}

module.exports = { fetchGoldPrice };

const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "goldPriceCache.json");


function saveCache(pricePerMg){
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ pricePerMg, timestamp: Date.now() }));
}

function readCache(){
  if (!fs.existsSync(CACHE_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  return data.pricePerMg;
}
