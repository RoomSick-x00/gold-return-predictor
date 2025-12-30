// Inside the function:
// function calculateBreakEvenPrice(price, quantity, gst) {
//   if (price > 0 && quantity > 0 && gst >= 0) {
//     // calculate total cost before GST
//     var totalCostBeforeGST = price * quantity;
//     // calculate GST
//     var gstAmount = (totalCostBeforeGST * gst) / 100;

//     var totalCostAfterGST = totalCostBeforeGST + gstAmount;

//     // return break-even price per gram
//     return totalCostAfterGST / quantity;
//   }
//   return null; // invalid input
// }

// to get user input in terminal
// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question("Enter the price per gram of gold: ", (priceInput) => {
//   const price = Number(priceInput);
//   rl.question("Enter the quantity in grams: ", (quantityInput) => {
//     const quantity = Number(quantityInput);
//     rl.question("Enter the GST percentage: ", (gstInput) => {
//       const gst = Number(gstInput);
//       const breakEven = calculateBreakEvenPrice(price, quantity, gst);
//       if (breakEven === null) {
//         console.log("Invalid input provided");
//       } else {
//         console.log("Break-even price per gram:", breakEven);
//       }
//     });
//   });
// });

// call it with sample values
// Steps:
// 1. Calculate total cost before GST
// 2. Calculate GST amount
// 3. Calculate total cost after GST
// 4. Calculate break-even price per gram
// Output:
// break-even price

// working on h multiple investments:
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
const investments = [];

function askInvestment(count, n, currentGoldPrice) {
  console.log(`\nInvestment ${count + 1}`);

  rl.question("Enter price per gram: ", (priceInput) => {
    const price = Number(priceInput);

    rl.question("Enter quantity in grams: ", (quantityInput) => {
      const quantity = Number(quantityInput);

      rl.question("Enter GST percentage: ", (gstInput) => {
        const gst = Number(gstInput);
        investments.push({ price, quantity, gst });
        if (count + 1 < n) {
          askInvestment(count + 1, n, currentGoldPrice);
        } else {
          const result = calculatePortfolioBreakEven(investments);
          const currentValue = currentGoldPrice * result.totalQuantity;
          console.log("--------------------------------");
          console.log("Investment Summary: ");
          console.log("Total Invested Amount:", result.totalInvested);
          console.log("Total Quantity (grams):", result.totalQuantity);
          console.log("Portfolio break-even price per gram:",result.breakEvenPricePerGram);
          console.log("Current Portfolio Value:", currentValue);
          console.log("--------------------------------");
          if (currentGoldPrice > result.breakEvenPricePerGram) {
            const profit =(currentGoldPrice - result.breakEvenPricePerGram)*result.totalQuantity;
            console.log("Status: PROFIT");
            console.log("Profit Amount:", profit.toFixed(2));
          } else if (currentGoldPrice < result.breakEvenPricePerGram) {
            const loss =(result.breakEvenPricePerGram - currentGoldPrice)*result.totalQuantity;
            console.log("Status: LOSS");
            console.log("Loss Amount:", loss.toFixed(2));
          } else {
            console.log("Status: BREAK-EVEN");
          }
          rl.close();
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

  return {
    breakEvenPricePerGram,
    totalInvested,
    totalQuantity,
  };
}

// const portfolioBreakEven = calculatePortfolioBreakEven(investments);
// console.log("Portfolio break-even price per gram:", portfolioBreakEven);
