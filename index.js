const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataFile = "gold-return-predictor\\portfolio.json";
let investments = [];

if (fs.existsSync(dataFile)) {
  const fileData = fs.readFileSync(dataFile, "utf-8");
  const parsedData = JSON.parse(fileData);

  if (Array.isArray(parsedData.investments)) {
    investments = parsedData.investments;
    console.log(`Loaded ${investments.length} portfolio investments.`);
  }
}

if (investments.length > 0) {
  console.log("1. Continue with existing portfolio");
  console.log("2. Start a new portfolio");

  rl.question("Choose an option (1 or 2): ", (choice) => {
    if (choice === "2") {
      investments = [];
      savePortfolio();
    }
    startInvestmentFlow();
  });
} else {
  startInvestmentFlow();
}

function savePortfolio(investements) {
  const data = JSON.stringify({ investments }, null, 2);
  fs.writeFileSync(dataFile, data);
}

function startInvestmentFlow() {
  rl.question("Enter the number of investements: ", (numberOfInvestements) => {
    const n = Number(numberOfInvestements);
    if (n <= 0) {
      console.log("Number of investments must be greater than 0");
      rl.close();
      return;
    }
    rl.question("Enter current gold price per gram: ", (currentPrice) => {
      const currentGoldPrice = Number(currentPrice);
      askInvestment(0, n, currentGoldPrice);
    });
  });
}


function askInvestment(count, n, currentGoldPrice) {
  console.log(`\nInvestment ${count + 1}`);

  rl.question("Enter price per gram: ", (priceInput) => {
    const price = Number(priceInput);

    rl.question("Enter quantity in grams: ", (quantityInput) => {
      const quantity = Number(quantityInput);

      rl.question("Enter GST percentage: ", (gstInput) => {
        const gst = Number(gstInput);
        investments.push({ price, quantity, gst });\
        savePortfolio(investments);
        if (count + 1 < n) {
          askInvestment(count + 1, n, currentGoldPrice);
        } else {
          const result = calculatePortfolioBreakEven(investments);
          
          const currentValue = currentGoldPrice * result.totalQuantity;
          console.log("--------------------------------");
          console.log("Investment Summary: ");
          console.log("Total Invested Amount:", result.totalInvested);
          console.log("Total Quantity (grams):", result.totalQuantity);
          console.log("Portfolio break-even price per gram:", result.breakEvenPricePerGram.toFixed(2));
          console.log("Portfolio break-even value:", result.breakEvenValue.toFixed(2));
          console.log("Current Portfolio Value:", currentValue.toFixed(2));
          console.log("--------------------------------");
          if (currentGoldPrice > result.breakEvenPricePerGram) {
            const profit =(currentGoldPrice - result.breakEvenPricePerGram) *result.totalQuantity;
            console.log("Status: PROFIT");
            console.log("Profit Amount:", profit.toFixed(2));
          } else if (currentGoldPrice < result.breakEvenPricePerGram) {
            const loss =(result.breakEvenPricePerGram - currentGoldPrice) *result.totalQuantity;
            console.log("Status: LOSS");
            console.log("Loss Amount:", loss.toFixed(2));
          } else {
            console.log("Status: BREAK-EVEN");
          }
          rl.question("Enter target profit amount: ", (targetProfit) => {
            const targetProfitAmount = Number(targetProfit);
            if (isNaN(targetProfitAmount) || targetProfitAmount < 0) {
              console.log("Invalid target profit amount");
              rl.close();
              return;
            }
            const targetPricePerGram =(result.totalInvested + targetProfitAmount) /result.totalQuantity;
            console.log(`To earn ₹${targetProfitAmount}\nGold must reach ₹${targetPricePerGram.toFixed(2)} per gram.`);
            const extraAboveBreakEven = targetPricePerGram - result.breakEvenPricePerGram;
            console.log(`That is ₹${extraAboveBreakEven.toFixed(2)} above break-even price`);
            rl.close();
          });
        }
      });
    });
  });
}

// const investments = [
//   {price: 14122, quantity: 0.1, gst: 3},
//   {price: 14500, quantity: 0.2, gst: 3}
// ];

function calculatePortfolioBreakEven(investments) {
  let totalInvested = 0;
  let totalQuantity = 0;

  for (let inv of investments) {
    const investedAmount = inv.price * inv.quantity * (1 + inv.gst / 100);
    totalInvested += investedAmount;
    totalQuantity += inv.quantity;
  }

  if (totalQuantity === 0) return null;

  const breakEvenPricePerGram = totalInvested / totalQuantity;
  const breakEvenValue = breakEvenPricePerGram * totalQuantity;


  return {
    breakEvenPricePerGram,
    breakEvenValue,
    totalInvested,
    totalQuantity,
  };
}

// const portfolioBreakEven = calculatePortfolioBreakEven(investments);
// console.log("Portfolio break-even price per gram:", portfolioBreakEven);
