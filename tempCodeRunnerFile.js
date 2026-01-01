function savePortfolio() {
  fs.writeFileSync(dataFile, JSON.stringify({ investments }, null, 2));
}