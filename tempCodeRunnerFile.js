rl.question("Enter the number of investements: ", (numberOfInvestements) => {
  const n = Number(numberOfInvestements);
  rl.question("Enter current gold price per gram: ", (currentPrice) => {
    const currentGoldPrice = Number(currentPrice);
    if (n <= 0) {
      console.log("Number of investments must be greater than 0");
      rl.close();
      return;
    }
    askInvestment(0, n);
  });
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
          console.log("--------------------------------");
          console.log("Investment Summary: ");
          console.log("Total Invested Amount:", result.totalInvested);
          console.log("Total Quantity (grams):", result.totalQuantity);
          console.log(
            "Portfolio break-even price per gram:",
            result.breakEvenPricePerGram
          );
          console.log("--------------------------------");
          if() (currentGoldPrice > result.breakEvenPricePerGram) {
            const profit = (currentGoldPrice - result.breakEvenPricePerGram) * result.totalQuantity;
            console.log("Status: PROFIT");
            console.log("Profit Amount:", profit);
          }
          else if (currentGoldPrice < result.breakEvenPricePerGram) {
            const loss = (result.breakEvenPricePerGram - currentGoldPrice) * result.totalQuantity;
            console.log("Status: LOSS");
            console.log("Loss Amount:", loss);
          }
          else {
            console.log("Status: BREAK-EVEN");
          }
          rl.close();
        }
      });
    });
  });
}