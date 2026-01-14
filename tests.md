# Gold Return Predictor — Manual Failure Test Plan

**Goal:** Test reliability and fallback behavior without frameworks.

**Fallback chain:**  
Live API → Cache → Manual Input


---

## 1. Missing API Key

**Scenario:** `METAL_API_KEY` not set in `.env`.

**How to Simulate:**  
- Remove `METAL_API_KEY` from `.env`

**Expected Behavior:**  
- App throws error at start: "METAL_API_KEY not set in environment"
- Process stops

**Fallback Path:** ❌ None (startup fails, intentional)

---

## 2. API Network Failure

**Scenario:** API is unreachable.

**How to Simulate:**  
- Turn off internet or set `API_URL` to invalid domain

**Expected Behavior:**  
- Console shows: "Live fetch failed, trying cache..."
- Falls back to cache if present
- If cache missing → prompts for manual input

**Fallback Path:**  
API ❌ → Cache ✅ → use cached price
API ❌ → Cache ❌ → Manual input ✅"


---

## 3. API Timeout / Slow Response

**Scenario:** API responds very slowly.

**How to Simulate:**  
- Throttle network or simulate timeout

**Expected Behavior:**  
- Request fails with timeout
- "Live fetch failed, trying cache..." is shown
- Fallback chain used as above

---

## 4. Corrupt Cache File

**Scenario:** `goldPriceCache.json` exists but contains invalid JSON.

**How to Simulate:**  
- Replace contents with random text or partial JSON

**Expected Behavior:**  
- JSON parse fails
- Error caught internally
- Fallback moves to manual input
- App continues without crash

**Fallback Path:**  
API ❌ → Cache ❌ → Manual input ✅


---

## 5. Missing Cache File

**Scenario:** `goldPriceCache.json` does not exist.

**How to Simulate:**  
- Delete cache file

**Expected Behavior:**  
- Cache read returns `null`
- Manual input fallback used if API unavailable

---

## 6. Missing Portfolio File

**Scenario:** `portfolio.json` does not exist.

**How to Simulate:**  
- Delete `portfolio.json`

**Expected Behavior:**  
- App initializes empty portfolio
- User informed: "Loaded 0 portfolio investments."

---

## 7. Corrupt Portfolio File

**Scenario:** `portfolio.json` contains invalid JSON.

**How to Simulate:**  
- Replace portfolio contents with invalid JSON

**Expected Behavior:**  
- JSON.parse throws
- Error must be caught (currently app may crash)
- Optionally, start with empty portfolio or ask user to fix file

---

## 8. Invalid User Input — Gold Price

**Scenario:** User enters negative, zero, or non-numeric price when manual input is prompted.

**How to Simulate:**  
- Enter: `-5000`, `abc`, or `0`

**Expected Behavior:**  
- Console shows: "Invalid gold price"
- App closes cleanly or reprompts

---

## 9. Invalid User Input — Investments

**Scenario:** User enters invalid numbers for quantity, GST, or total invested.

**How to Simulate:**  
- Enter: negative values, zero, non-numeric input

**Expected Behavior:**  
- Input rejected
- User prompted again
- Portfolio state remains consistent

---

## 10. Invalid User Input — Yearly Growth / Simulation

**Scenario:** User enters invalid number when asked for yearly growth or months.

**How to Simulate:**  
- Enter: `-5`, `0`, `abc`

**Expected Behavior:**  
- Console shows validation error
- Returns to main menu
- No NaN used in calculations

---

## 11. Unexpected API Response Structure

**Scenario:** API returns missing or malformed `XAU` field.

**How to Simulate:**  
- Mock API response locally without `XAU` field

**Expected Behavior:**  
- Parse fails → fallback to cache/manual input
- Console shows error about live fetch
- App continues

---

**Reliability Invariants:**

- Portfolio calculations never altered
- App never crashes on bad external data
- Fallback path always deterministic
- User always retains control
