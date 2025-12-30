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
  askInvestment(0, n);
});
const investments = [];

function askInvestment(count, n) {
  console.log(`\nInvestment ${count + 1}`);

  rl.question("Enter price per gram: ", (priceInput) => {
    const price = Number(priceInput);

    rl.question("Enter quantity in grams: ", (quantityInput) => {
      const quantity = Number(quantityInput);

      rl.question("Enter GST percentage: ", (gstInput) => {
        const gst = Number(gstInput);

        investments.push({ price, quantity, gst });

        if (count + 1 < n) {
          askInvestment(count + 1, n);
        } else {
          const result = calculatePortfolioBreakEven(investments);
          console.log("Portfolio break-even price per gram:", result);
          console.log("--------------------------------");
          console.log("Investment Summary: ");
          console.log("Total Invested Amount:", totalInvested);
          console.log("Total Quantity (grams):", totalQuantity);
          console.log("--------------------------------");
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

let totalInvested = 0;
let totalQuantity = 0;
function calculatePortfolioBreakEven(investments) {

  for (let inv of investments) {
    const investedAmount = inv.price * inv.quantity * (1 + inv.gst / 100);
    totalInvested += investedAmount;
    totalQuantity += inv.quantity;
  }

  if (totalQuantity === 0) return null;

  return totalInvested / totalQuantity;
}

// const portfolioBreakEven = calculatePortfolioBreakEven(investments);
// console.log("Portfolio break-even price per gram:", portfolioBreakEven);
