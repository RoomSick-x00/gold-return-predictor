# Gold Return Predictor

A CLI-based Node.js tool to track gold investments and understand
break-even, profit/loss, and target prices after GST.

---

## Problem

Gold investors often do not know when they actually enter profit
because GST is added at purchase time.
This tool helps calculate the true break-even and portfolio status.

---

## Tech Stack

- Node.js
- JavaScript
- File system (fs)
- CLI input (readline)

---

## v0.1 – Single Investment Break-even

- Input:
  - Buy price per gram
  - Quantity
  - GST %
- Output:
  - Break-even price per gram

---

## v0.2 – Multiple Investments

- Supports multiple investments
- Break-even calculated using:
  - Total Invested / Total Quantity
- Total Invested includes GST for each investment
- Scope:
  - No live prices
  - No brokerage or making charges

---

## v0.3 – Portfolio Persistence

- Investments saved locally in `portfolio.json`
- Portfolio loaded automatically on app start
- Option to continue or reset portfolio

---

## v0.4 – Improved UX & Flexibility

- Two investment input modes:
  1. Price + Quantity + GST
  2. Total Amount Invested + Price + GST (quantity auto-calculated)
- Displays:
  - Break-even price per gram
  - Break-even portfolio value
- Improved CLI flow and summaries

---

## v0.5 – Portfolio & Profit Intelligence (Current)

### Features

- Persistent portfolio across sessions
- Menu-driven CLI interface
- Gold price asked once per session
- Portfolio summary including:
  - Total invested amount
  - Total quantity (grams)
  - Break-even price per gram
  - Break-even portfolio value
  - Current portfolio value
- Profit / loss calculation
- Target profit support:
  - Calculates target gold price
  - Detects if target is already achieved
- Safe portfolio clearing with confirmation

### Does NOT include

- Live gold price API
- Historical price data
- Date-based predictions

---

## Planned (Future Versions)

### v0.6
- Export portfolio summary to file
- Mock price history simulation
- Basic target date estimation (assumption-based)

---

## Notes

- This project focuses on clarity and correctness, not prediction accuracy
- Designed as a learning and portfolio project
