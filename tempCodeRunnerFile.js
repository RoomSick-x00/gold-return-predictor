const readline = require("readline");

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