// Inside the function: 
function calculateBreakEvenPrice(price, quantity, gst) {
  if (price > 0 && quantity > 0 && gst >= 0) {
    // calculate total cost before GST
    var totalCostBeforeGST = price * quantity;
    // calculate GST
    var gstAmount = (totalCostBeforeGST * gst) / 100;

    var totalCostAfterGST = totalCostBeforeGST + gstAmount;

    // return break-even price per gram
    return totalCostAfterGST / quantity;
  }
  return null; // invalid input
}


// to get user input in terminal
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the price per gram of gold: ", (priceInput) => {
  const price = Number(priceInput);
  rl.question("Enter the quantity in grams: ", (quantityInput) => {
    const quantity = Number(quantityInput);
    rl.question("Enter the GST percentage: ", (gstInput) => {
      const gst = Number(gstInput);
      const breakEven = calculateBreakEvenPrice(price, quantity, gst);
      if (breakEven === null) {
        console.log("Invalid input provided");
      } else {
        console.log("Break-even price per gram:", breakEven);
      }
    });
  });
});



// call it with sample values
// Steps:
// 1. Calculate total cost before GST
// 2. Calculate GST amount
// 3. Calculate total cost after GST
// 4. Calculate break-even price per gram
// Output:
// break-even price
