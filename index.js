const fs = require("fs");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataFile = path.join(__dirname, "portfolio.json");
let investments = [];

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  })
}

if (fs.existsSync(dataFile)) {
  const fileData = fs.readFileSync(dataFile, "utf-8");
  const parsedData = JSON.parse(fileData);

  if (Array.isArray(parsedData.investments)) {
    investments = parsedData.investments;
    console.log(`Loaded ${investments.length} portfolio investments.`);
  }
}

console.log("Welcome to Gold Return Predictor");

rl.question("Enter current gold price per gram: ", (priceInput) => {
  const currentGoldPrice = Number(priceInput);

  if (isNaN(currentGoldPrice) || currentGoldPrice <= 0) {
    console.log("Invalid gold price");
    rl.close();
    return;
  }

  showMainMenu(currentGoldPrice);
});

function confirmClearPortfolio(currentGoldPrice) {
  console.log("⚠️ This will permanently delete all investments.");
  rl.question("Type YES to confirm, or anything else to cancel: ", (answer) => {
    if (answer.trim().toUpperCase() === "YES") {
      investments = [];
      savePortfolio(investments);
      console.log("Portfolio Cleared.");
    }
    else {
      console.log("Clear portfolio cancelled.");
    }
    showMainMenu(currentGoldPrice);
  });
}

async function finalizePortfolio(investments, currentGoldPrice) {
  const status = getPortfolioStatus(investments, currentGoldPrice);
  printPortfolioSummary(status);
  console.log("--------------------------------");
  const answer = (await ask("Do you want to simulate future portfolio value? Type YES to simulate, or anything else to return: ")).trim().toUpperCase();

  if (answer === "YES") {
    await simulateFuturePortfolio(investments, currentGoldPrice);
    const answer2 = (await ask("Do you want to estimate the months required to reach your target profit? Type YES to estimate, or anything else to return: ")).trim().toUpperCase();
    if (answer2 === "YES") {
      await estimateTargetMonths(investments, currentGoldPrice);
      return;
    }
  }

  showMainMenu(currentGoldPrice);
}


function startInvestmentFlow(currentGoldPrice) {
  rl.question("Enter the number of investements: ", (numberOfInvestements) => {
    const n = Number(numberOfInvestements);
    if (n <= 0) {
      console.log("Number of investments must be greater than 0");
      rl.close();
      return;
    }
    // askInvestment(0, n, currentGoldPrice);
    console.log("How do you want to add investments?");
    console.log("1. Price + Quantity + GST");
    console.log("2. Total Amount Invested + Price + GST");
    rl.question("choose an option (1 or 2): ", (option) => {
      if (option !== "1" && option !== "2") {
        console.log("Invalid option selected. Exiting.");
        rl.close();
        return;
      }
      const choice = Number(option);
      askInvestment(0, n, currentGoldPrice, choice);
    });
  });
}

function getPortfolioStatus(investments, currentGoldPrice) {
  const result = calculatePortfolioBreakEven(investments);
  const currentValue = currentGoldPrice * result.totalQuantity;
  const pnl = currentValue - result.totalInvested;

  return {
    totalInvested: result.totalInvested,
    totalQuantity: result.totalQuantity,
    breakEvenPricePerGram: result.breakEvenPricePerGram,
    breakEvenValue: result.breakEvenValue,
    currentValue,
    pnl,
    status:
      pnl > 0 ? "PROFIT" :
        pnl < 0 ? "LOSS" : "BREAK-EVEN"
  };
}

function printPortfolioSummary(status) {
  console.log("--------------------------------");
  console.log("📊 Portfolio Status");
  console.log("Current Value : ₹", status.currentValue.toFixed(2));
  console.log("Invested      : ₹", status.totalInvested.toFixed(2));
  console.log("--------------------------------");

  console.log("Investment Summary:");
  console.log("Total Quantity (grams):", status.totalQuantity);
  console.log(
    "Portfolio break-even price per gram:",
    status.breakEvenPricePerGram.toFixed(2)
  );
  console.log(
    "Portfolio break-even value:",
    status.breakEvenValue.toFixed(2)
  );
  console.log("--------------------------------");

  if (status.status === "PROFIT") {
    console.log("Status: PROFIT");
    console.log("Profit Amount:", status.pnl.toFixed(2));
  } else if (status.status === "LOSS") {
    console.log("Status: LOSS");
    console.log("Loss Amount:", Math.abs(status.pnl).toFixed(2));
  } else {
    console.log("Status: BREAK-EVEN");
  }
}

function savePortfolio(investments) {
  const data = JSON.stringify({ investments }, null, 2); fs.writeFileSync(dataFile, data);
}

async function estimateTargetMonths(investments, currentGoldPrice) {
  const result = calculatePortfolioBreakEven(investments);

  const input = await ask("Enter target profit amount (₹): ");
  if (yearlyGrowth === null) return;
  const targetProfitAmount = Number(input);


  if (isNaN(targetProfitAmount) || targetProfitAmount <= 0) {
    console.log("Invalid target profit amount.");
    showMainMenu(currentGoldPrice);
    return;
  }

  const targetPricePerGram = (result.totalInvested + targetProfitAmount) / result.totalQuantity;

  console.log(`\nTo earn ₹${targetProfitAmount}, gold must reach ₹${targetPricePerGram.toFixed(2)} per gram.`);

  console.log(`That is ₹${(targetPricePerGram - result.breakEvenPricePerGram).toFixed(2)} above break-even price.`);

  const yearlyGrowth = await askYearlyGrowth(currentGoldPrice);
  const monthlyGrowth = yearlyGrowth / 12;
  let simulatedPrice = currentGoldPrice;

  const MAX_MONTHS = 1200;

  for (let month = 1; month <= MAX_MONTHS; month++) {
    simulatedPrice = simulatedPrice * (1 + monthlyGrowth / 100);

    if (simulatedPrice >= targetPricePerGram) {
      console.log(`\nAt ${yearlyGrowth}% yearly growth, the target profit may be reached in approximately ${month} months.`);
      showMainMenu(currentGoldPrice);
      return;
    }
  }

  console.log("\nTarget not reached within reasonable simulation period.");
  showMainMenu(currentGoldPrice);
}


function askInvestment(count, n, currentGoldPrice, choice) {
  function proceed(investmentData) {
    investments.push(investmentData);
    savePortfolio(investments);
    if (count + 1 < n) {
      askInvestment(count + 1, n, currentGoldPrice, choice);
    } else {
      finalizePortfolio(investments, currentGoldPrice);
    }
  }

  if (choice == 1) {
    console.log(`\nInvestment ${count + 1}`);
    rl.question("Enter price per mg: ", (priceInput) => {
      const pricePerMg = Number(priceInput);
      const price = pricePerMg * 1000;
      rl.question("Enter quantity in grams: ", (quantityInput) => {
        const quantity = Number(quantityInput);
        rl.question("Enter GST percentage: ", (gstInput) => {
          const gst = Number(gstInput);
          proceed({ price, quantity, gst });
        });
      });
    });
  }

  if (choice == 2) {
    console.log(`\nInvestment ${count + 1}`);
    rl.question("Enter price per mg: ", (priceInput) => {
      const pricePerMg = Number(priceInput);
      const price = pricePerMg * 1000;
      rl.question("Enter GST percentage: ", (gstInput) => {
        const gst = Number(gstInput);
        rl.question("Enter total amount invested: ", (amountInput) => {
          const totalAmount = Number(amountInput);
          const netAmount = totalAmount / (1 + gst / 100);
          const quantity = netAmount / price;
          proceed({ price, quantity, gst });
        });
      });
    });
  }
}

async function askYearlyGrowth(currentGoldPrice) {
  const input = await ask("Enter the yearly gold price increase percentage to simulate: ");
  const yearlyGrowth = Number(input);

  if (isNaN(yearlyGrowth) || yearlyGrowth <= 0) {
    console.log("Invalid yearly growth percentage.");
    showMainMenu(currentGoldPrice);
    return null;
  }

  return yearlyGrowth;
}

async function simulateFuturePortfolio(investments, currentGoldPrice) {
  const result = calculatePortfolioBreakEven(investments);

  const yearlyGrowth = await askYearlyGrowth(currentGoldPrice);
  if (yearlyGrowth === null) return;

  const monthlyGrowth = yearlyGrowth / 12;

  const monthsInput = await ask("Enter number of months to simulate: ");
  const months = Number(monthsInput);

  let simulatedPrice = currentGoldPrice;

  for (let month = 1; month <= months; month++) {
    console.log(`\n --- Month ${month} ---`);
    simulatedPrice = simulatedPrice * (1 + monthlyGrowth / 100);
    console.log("Simulated Gold Price per gram: ₹", simulatedPrice.toFixed(2));
    const simulatedValue = simulatedPrice * result.totalQuantity;
    console.log(`Current Value : ₹${simulatedValue.toFixed(2)}`);
  }
}

function showMainMenu(currentGoldPrice) {
  console.log("\n======== Main Menu ========");
  console.log("1. View Portfolio Summary");
  console.log("2. Add New Investments");
  console.log("3. Clear Portfolio");
  console.log("4. Exit");

  rl.question("Choose an option (1-4): ", (option) => {
    switch (option) {
      case "1":
        if (investments.length === 0) {
          console.log("Portfolio is empty.");
          showMainMenu(currentGoldPrice);
        }
        else {
          finalizePortfolio(investments, currentGoldPrice);
        }
        break;

      case "2":
        startInvestmentFlow(currentGoldPrice)
        break;

      case "3":
        confirmClearPortfolio(currentGoldPrice);
        break;

      case "4":
        rl.close();
        break;

      default:
        console.log("Invalid option. Please choose again.");
        showMainMenu(currentGoldPrice);
        break;
    }
  });
}

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
