// Input:
// buy price per gram(24k gold to invest online)
var price = 14122;

// quantity in grams
var quantity = 0.1;

// GST percentage
var gst = 3;

// Steps:
// 1. Calculate total cost before GST
var totalCostBeforeGST = price*quantity;

// 2. Calculate GST amount
var gstAmount = (totalCostBeforeGST * gst) /100;

// 3. Calculate total cost after GST
var totalCostAfterGST = totalCostBeforeGST + gstAmount;

// 4. Calculate break-even price per gram
var breakEvenPricePerGram = totalCostAfterGST/quantity;

// Output:
// break-even price
console.log("Break-even price per gram:", breakEvenPricePerGram.toFixed(2));

