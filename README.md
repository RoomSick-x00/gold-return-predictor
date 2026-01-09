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

## v0.6 – Future Portfolio Simulation (Assumption-Based)

### Overview
Version **v0.6** introduces a **future portfolio simulation** feature.  
This allows users to explore how their existing gold portfolio *might* behave over time based on a **user-defined yearly growth assumption**.

⚠️ This is a **simulation**, not a prediction.  
No real market data, APIs, or historical prices are used.

---

### Key Idea
> “If gold price grows at a steady rate, how does my portfolio value change month by month?”

The feature helps users **visualize progression over time**, without making promises or financial claims.

---

### How It Works
1. The app asks for the **current gold price** once per session (same as v0.5).
2. User views their portfolio summary.
3. After viewing the summary, the user is asked whether they want to simulate future performance.
4. If yes, the app asks for:
   - **Expected yearly gold price growth (%)**
   - **Number of months to simulate**
5. The yearly growth rate is converted into a **monthly growth rate**.
6. Gold price is simulated **month by month** using simple compounding.
7. For each month, the app displays:
   - Month number
   - Simulated gold price per gram
   - Simulated total portfolio value

---

### Growth Calculation Logic
- Yearly growth is divided equally across months:
  monthlyGrowth = yearlyGrowth / 12
- Each month’s price is calculated as:
  newPrice = previousPrice × (1 + monthlyGrowth / 100)

- Portfolio value is recalculated using the **existing total gold quantity**.

This approach is:
- Simple
- Transparent
- Easy to reason about
- Suitable for CLI-based learning and exploration

---

### What v0.6 Does NOT Do
- ❌ No real-time or historical price data
- ❌ No live APIs
- ❌ No target profit or target date estimation
- ❌ No financial advice or guarantees
- ❌ No changes to v0.5 portfolio logic

---

### Why This Feature Exists
- To introduce **time progression** into the project
- To keep assumptions explicit and user-controlled
- To prepare the foundation for future features like:
- Target date estimation (planned for v0.7)
- More advanced simulations (optional)

---

### Design Notes
- v0.5 logic is treated as **frozen**
- Simulation logic builds **on top of** existing calculations
- Focus is on clarity and UX, not complex math or forecasting

---

### Disclaimer
This feature is for **educational and exploratory purposes only**.  
All results depend entirely on user-provided assumptions.
---

## 📈 v0.7 — Future Portfolio Prediction (Assumption-Based)

Version **v0.7** introduces **future-oriented analysis features** that help users explore *possible* outcomes of their gold investments using **user-defined growth assumptions**.

> ⚠️ This version does **not** use real market data or APIs.  
> All results are **simulations**, not predictions.

---

### ✨ New Features in v0.7

#### 1️⃣ Future Portfolio Simulation
- Simulates how the portfolio value may change over time
- User provides:
  - Assumed **yearly gold price growth (%)**
  - Number of **months** to simulate
- The app:
  - Converts yearly growth to **monthly compounded growth**
  - Prints simulated gold price and portfolio value month-by-month

#### 2️⃣ Target Profit Time Estimation
- User provides a **target profit amount**
- The app calculates:
  - Required **target price per gram**
  - Difference above **break-even price**
- Using the same assumed yearly growth:
  - Estimates the **approximate number of months** needed to reach the target

#### 3️⃣ Reusable Growth Input (UX & Code Improvement)
- Yearly growth input is handled by a shared helper function
- Prevents duplicate prompts and logic
- Keeps growth assumptions consistent across features

---

### 🔁 User Flow (High Level)

1. User views **Portfolio Summary**
2. App asks whether to:
   - Simulate future portfolio value
3. After simulation, user may choose to:
   - Estimate time to reach a target profit
4. User is safely returned to the main menu

All flows are optional and non-destructive.

---

### 📐 Calculation Logic Used

- **Monthly Growth Conversion**
  monthlyGrowth = yearlyGrowth / 12 

- **Monthly Price Update**
  monthlyGrowth = yearlyGrowth / 12

- **Monthly Price Update**
  price = price × (1 + monthlyGrowth / 100)

- Portfolio quantity remains constant during simulation

---

### 🧠 Design Notes

- v0.7 does **not modify** any existing portfolio data
- All calculations are performed **in-memory**
- Async flow is managed using **callbacks**, not Promises
- `onDone()` callbacks are used to ensure:
- No overlapping CLI prompts
- Predictable menu flow

---

### ⚠️ Limitations (Intentional)

- No live gold prices
- No historical trends
- No volatility or randomness
- No inflation or taxation modeling

These are planned considerations for future versions.

---

### ✅ Version Status

- v0.5 → Portfolio & calculations (Frozen)
- v0.6 → Internal structure & groundwork
- **v0.7 → Future simulation & target estimation**
- Status: **Stable**

---
## v0.8 – Portfolio Logic Refactor & Clean Architecture

### ✨ What’s New

Version **v0.8** focuses on improving **code structure, readability, and reusability** without changing user-facing behavior.

The portfolio summary logic has been refactored into **dedicated helper functions**, following the **single-responsibility principle**.

---

### 🔹 New Core Functions

#### 1. `getPortfolioStatus(investments, currentGoldPrice)`

A **pure logic function** that:
- Calculates portfolio metrics
- Determines profit / loss / break-even status
- Returns structured data instead of printing

**Returns:**
- Total invested amount
- Total gold quantity
- Break-even price per gram
- Break-even portfolio value
- Current portfolio value
- PnL (profit or loss)
- Portfolio status (`PROFIT`, `LOSS`, `BREAK-EVEN`)

This function contains **no user input or console output**, making it reusable and testable.

---

#### 2. `printPortfolioSummary(status)`

A **presentation-only function** that:
- Takes the object returned by `getPortfolioStatus`
- Prints a formatted portfolio summary to the console

This cleanly separates **calculation logic** from **display logic**.

---

### 🔹 Updated `finalizePortfolio` Flow

`finalizePortfolio` now acts as an **orchestrator**:
- Fetches portfolio status using `getPortfolioStatus`
- Displays results using `printPortfolioSummary`
- Handles user decisions (simulate future value, estimate target months, return to menu)

This makes the function:
- Shorter
- Easier to read
- Easier to extend in future versions

---

### 🧠 Why This Matters

- Improves maintainability as features grow
- Enables future enhancements like:
  - CSV/JSON exports
  - Graphs and visualizations
  - Automated tests
  - GUI or API integration
- Reduces duplicated calculations across features

---

### 🧱 Architectural Improvements

- Clear separation of:
  - **Business logic**
  - **Console output**
  - **User flow control**
- Lays foundation for async/await refactor in future versions

---

### 🚀 Summary

v0.8 does not add new features, but significantly improves **internal design quality**, making the application easier to scale, debug, and enhance in upcoming releases.

### API thing
### AI MODEL PRED.

v0.9 working with those api 
live test actally excited about it and how it works


looking upto v1.0
### v1.0
