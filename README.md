🪙 Gold Return Predictor (CLI)
Problem

Gold investors often don’t know when they actually enter profit after GST, especially when investments are made at different prices and times.

What this project aims to do

Track multiple gold investments

Calculate portfolio break-even after GST

Show current profit / loss

Help investors understand what price is needed to reach a target profit

Current Status

Actively working CLI application (v0.3+)

Core investment logic is implemented, portfolio persistence works, and UX improvements are in progress.

Tech Stack

Node.js

readline (CLI input)

fs (local file persistence using JSON)

Implemented Features (Current)
📥 Investment Input

User can input multiple investments using two methods:

Price + Quantity + GST

Total Amount Invested + Price + GST
(Quantity is auto-calculated after deducting GST)

🧮 Portfolio Calculations

Total invested amount (GST included)

Total gold quantity (grams)

Portfolio break-even price per gram

Portfolio break-even value

Current portfolio value (based on current gold price)

Profit / Loss status

Exact profit or loss amount

🎯 Target Profit Estimation

User enters desired profit amount

App calculates:

Required gold price per gram

Amount above break-even price

💾 Portfolio Persistence

Investments are saved locally in portfolio.json

On startup:

Existing portfolio is loaded

User can choose to continue or start fresh

Example Output

Total Invested Amount

Total Quantity (grams)

Break-even price per gram

Break-even portfolio value

Current value

PROFIT / LOSS status

Target price for desired profit

Version History
v0.1

Single investment

Break-even calculation after GST

v0.2

Multiple investments

Collective portfolio break-even price

Formula:

break-even price = total invested / total quantity

v0.3 (Completed)

Local portfolio saving (JSON)

Load existing investments on app start

Profit / loss calculation

Target profit → required gold price

v0.4 (In Progress)

Improved UX and clearer summaries

Support multiple input formats (amount-based input)

Better break-even value visibility

Cleaner CLI flow

Current Scope & Limitations

No live gold price fetching

No future price prediction

Brokerage / making charges not included

Manual price input only

Roadmap
v0.4 (UX Focus)

Cleaner CLI prompts

More intuitive summaries

Better separation of concerns in code

v0.5

Price history simulation

Basic target date estimation

Export portfolio summary