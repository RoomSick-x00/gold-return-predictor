# Gold Return Predictor (v0.1)

Problem:
Gold investors don’t know when they actually enter profit after GST.

What this project aims to do:
- Track gold prices
- Calculate break-even after GST
- Estimate when a target price may be achieved

Current status:
Planning & setup phase.

Tech stack (tentative):
Not fixed yet.


v0.1 Goal:
- User can input:
  - buy price
  - quantity
  - GST %
- App shows:
  - break-even price

v0.2 Goal:
- User can input:
  - multiple investments with price, quantity and GST
- App shows: 
  - the collectibve break-even price
- Break even is calculated simply:
  - break-even price = total invested / total quantity
  - Total invested includes price × quantity + GST for each investment
- Example:
  Investment 1:
  - Price: 1000 ₹/g
  - Quantity: 1 g
  - GST: 3%
  - Invested amount: 1030 ₹

  Investment 2:
  - Price: 1200 ₹/g
  - Quantity: 1 g
  - GST: 3%
  - Invested amount: 1236 ₹

  Total invested = 2266 ₹
  Total quantity = 2 g

  Portfolio break-even price = 1133 ₹/g
- Current Scope:
  - Calculates break-even price only
  - Does not predict future prices
  - Does not include brokerage or making charges

Planned Enhancements:
- Loop-based CLI input for multiple investments
- Live gold price comparison
- Target price estimation

## Roadmap

### v0.3
- Save investments locally (JSON file)
- Load previous portfolio on app start

### v0.4
- Support investment input by total invested amount (auto-calculate quantity after GST)
- Display break-even portfolio value in addition to break-even price per gram
- Show amount above/below break-even for better UX

### v0.5
- Price history simulation
- Target date estimation (basic)



