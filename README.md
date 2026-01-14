# Gold Return Predictor

A **CLI-based Node.js application** that helps gold investors understand their **true break-even price**, **portfolio value**, and **profit or loss**, taking **GST into account**.

The tool focuses on **clarity and correctness**, not prediction or speculation.

---

## Why This Project Exists

When buying physical gold, **GST is added at purchase time**, which means:

- The market price must rise **above the buy price** just to break even
- Many investors incorrectly assume profit earlier than reality

This project answers a simple but critical question:

> “At what gold price am I *actually* in profit?”

---

## What the App Does (Current Scope)

- Tracks **multiple gold investments**
- Accounts for **GST** in all calculations
- Maintains a **persistent portfolio** across sessions
- Computes:
  - Total invested amount
  - Total gold quantity (grams)
  - Break-even price per gram
  - Break-even portfolio value
  - Current portfolio value
  - Profit or loss
- Supports **target profit analysis**
- Fetches **live gold prices** with safe fallbacks

This is a **calculation and tracking tool**, not a forecasting engine.

---

## Core Design Philosophy

- **Deterministic**: Same input → same output
- **GST-aware**: All math reflects real-world purchase costs
- **Fail-safe**: App never crashes due to API or network failure
- **CLI-first**: Simple, linear, distraction-free flow
- **Learning-oriented**: Logic is explicit and explainable

---

## Tech Stack

- Node.js
- JavaScript
- File System (`fs`)
- CLI input (`readline`)
- Environment variables (`dotenv`)

---

## Application Flow (Mental Model)

1. App starts
2. Attempts to fetch **live gold price**
3. Fallback order if live price fails:
   - Cached price
   - Manual user input
4. Portfolio is loaded from `portfolio.json`
5. User interacts via a **menu-driven CLI**
6. All calculations are done **in-memory**
7. Portfolio updates are persisted safely

---

## Live Gold Price Handling (v1.1)

The app follows a **safe, layered fallback strategy**:

