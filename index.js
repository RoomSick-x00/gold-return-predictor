const fs = require("fs");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataFile = path.join(__dirname, "portfolio.json");
let investments = [];

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

function finalizePortfolio(investments, currentGoldPrice) {
  const result = calculatePortfolioBreakEven(investments);
  const currentValue = currentGoldPrice * result.totalQuantity;
  console.log("--------------------------------");
  console.log("📊 Portfolio Status");
  console.log("Current Value : ₹", currentValue.toFixed(2));
  console.log("Invested      : ₹", result.totalInvested.toFixed(2));
  console.log("--------------------------------");
  console.log("Investment Summary: ");
  console.log("Total Invested Amount:", result.totalInvested);
  console.log("Total Quantity (grams):", result.totalQuantity);
  console.log("Portfolio break-even price per gram:", result.breakEvenPricePerGram.toFixed(2));
  console.log("Portfolio break-even value:", result.breakEvenValue.toFixed(2));
  console.log("--------------------------------");
  if (currentGoldPrice > result.breakEvenPricePerGram) {
    const profit = (currentGoldPrice - result.breakEvenPricePerGram) * result.totalQuantity;
    console.log("Status: PROFIT");
    console.log("Profit Amount:", profit.toFixed(2));
  } else if (currentGoldPrice < result.breakEvenPricePerGram) {
    const loss = (result.breakEvenPricePerGram - currentGoldPrice) * result.totalQuantity;
    console.log("Status: LOSS");
    console.log("Loss Amount:", loss.toFixed(2));
  } else {
    console.log("Status: BREAK-EVEN");
  }
  console.log("--------------------------------");
  console.log("Do you want to simulate future portfolio value?");
  rl.question("Type YES to simulate, or anything else to return to main menu: ", (answer) => {
    if (answer.trim().toUpperCase() === "YES") {
      simulateFuturePortfolio(investments, currentGoldPrice, () => {
        console.log("Do you want to estimate the months required to reach your target profit?");
        rl.question("Type YES to estimate, or anything else to return to main menu: ", (answer2) => {
          if (answer2.trim().toUpperCase() === "YES") {
            estimateTargetMonths(investments, currentGoldPrice);
            return;
          }
          showMainMenu(currentGoldPrice);
        });
      });
      return;
    }
    showMainMenu(currentGoldPrice);
  });
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

function savePortfolio(investments) {
  const data = JSON.stringify({ investments }, null, 2); fs.writeFileSync(dataFile, data);
}

function estimateTargetMonths(investments, currentGoldPrice) {
  const result = calculatePortfolioBreakEven(investments);

  rl.question("Enter target profit amount (₹): ", (input) => {
    const targetProfitAmount = Number(input);

    if (isNaN(targetProfitAmount) || targetProfitAmount <= 0) {
      console.log("Invalid target profit amount.");
      showMainMenu(currentGoldPrice);
      return;
    }

    const targetPricePerGram = (result.totalInvested + targetProfitAmount) / result.totalQuantity;

    console.log(`\nTo earn ₹${targetProfitAmount}, gold must reach ₹${targetPricePerGram.toFixed(2)} per gram.`);

    console.log(`That is ₹${(targetPricePerGram - result.breakEvenPricePerGram).toFixed(2)} above break-even price.`);

    askYearlyGrowth((yearlyGrowth) => {
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
    });
  });
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

function askYearlyGrowth(callback) {
  rl.question(
    "Enter the yearly gold price increase percentage to simulate: ",
    (input) => {
      const yearlyGrowth = Number(input);

      if (isNaN(yearlyGrowth) || yearlyGrowth <= 0) {
        console.log("Invalid yearly growth percentage.");
        showMainMenu(currentGoldPrice);
        return;
      }

      callback(yearlyGrowth);
    }
  );
}


function simulateFuturePortfolio(investments, currentGoldPrice, onDone) {
  const result = calculatePortfolioBreakEven(investments);
  askYearlyGrowth((yearlyGrowth) => {
    const monthlyGrowth = yearlyGrowth / 12;
    rl.question("Enter number of months to simulate: ", (monthsInput) => {
      const months = Number(monthsInput);
      let simulatedPrice = currentGoldPrice;
      for (let month = 1; month <= months; month++) {
        console.log(`\n --- Month ${month} ---`);
        simulatedPrice = simulatedPrice * (monthlyGrowth / 100 + 1);
        console.log("Simulated Gold Price per gram: ₹", simulatedPrice.toFixed(2));
        const simulatedValue = simulatedPrice * result.totalQuantity;
        console.log(`Current Value : ₹${simulatedValue.toFixed(2)}`);
      }
      onDone();
    });
  });
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
