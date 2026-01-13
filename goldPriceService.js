const https = require("https");
const API_URL = "https://api.metalpriceapi.com/v1/latest?api_key=6797ef4b91f9d7a07ad4b9027289988f&base=INR&currencies=EUR,XAU,XAG"; 

async function fetchGoldPrice(){
  const response = await fetch(API_URL);
  const data = await response.json();
  const goldPriceInINRPerTroyOunce = 1/data.rates.XAU;
  const goldPriceInINRPerGram = goldPriceInINRPerTroyOunce / 31.1034768;
  const goldPricePerMgram = goldPriceInINRPerGram/1000;
  console.log(`Current Gold Price in INR per milligram: ₹${goldPricePerMgram.toFixed(4)}`);
}

fetchGoldPrice();