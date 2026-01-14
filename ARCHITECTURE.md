# ARCHITECTURE.md

## Gold Return Predictor — Architecture Overview

This document explains the internal structure, startup flow,
and gold price resolution logic of the Gold Return Predictor CLI application.

The focus is clarity, reliability, and learning-friendly design.

------------------------------------------------------------

## 1. High-Level Architecture

The application is a CLI-based Node.js program with three main layers:

1. Startup & Configuration
2. Gold Price Resolution
3. Portfolio Logic & User Interaction

There is no server or framework.
Execution begins immediately when the script runs.

------------------------------------------------------------

## 2. Startup Flow (Execution Order)

When the application starts, the following steps happen in order:

### Step 1: Load Dependencies
- fs (file system)
- readline (CLI input)
- dotenv (environment variables)
- Internal modules (portfolio logic, gold price service)

No user input or calculations happen here.

------------------------------------------------------------

### Step 2: Load Portfolio From Disk

- The app checks for `portfolio.json`
- If found:
  - Investments are loaded into memory
- If not found:
  - An empty portfolio is initialized

This ensures portfolio persistence across sessions.

------------------------------------------------------------

### Step 3: Resolve Current Gold Price (Critical Step)

Before showing any menu or calculations, the app resolves
the current gold price per gram using a fallback chain:

Live API → Cached Price → Manual Input

This guarantees the app always continues.

------------------------------------------------------------

### Step 4: Enter Main Menu Loop

Once a valid gold price is available:
- The main menu starts
- The same gold price is used for the entire session
- The user is not asked again unless the app restarts

------------------------------------------------------------

## 3. Gold Price Resolution Strategy

The app uses a three-level fallback mechanism:

Live API
↓
Cached Price
↓
Manual Input

The goal is reliability, not dependency on the network.

------------------------------------------------------------

## 4. Live API Fetch (Primary Source)

What happens:
- Fetches live gold price from an external API
- Converts:
  XAU → INR → per gram

Why this is first:
- Most accurate
- Zero user effort
- Real-world relevance

Failure handling:
- Network error
- Timeout
- Invalid response
- Missing API key

On failure, the app does NOT crash.
It silently falls back to cache.

------------------------------------------------------------

## 5. Cached Price (Secondary Fallback)

What happens:
- Reads `goldPriceCache.json`
- Uses last successful fetched price

Why this exists:
- Offline support
- API failure safety
- Faster startup when network is unstable

Design notes:
- Cache is written only after successful API fetch
- Cache is read synchronously for CLI simplicity

------------------------------------------------------------

## 6. Manual Input (Final Fallback)

When used:
- API fails
- Cache missing or invalid

What happens:
- User manually enters gold price per gram
- That price is used for the current session

Why this matters:
- App always remains usable
- No hard dependency on external services

------------------------------------------------------------

## 7. Session Price Locking

Once the gold price is resolved:
- Stored in memory
- Used consistently for:
  - Portfolio summary
  - Profit / loss
  - Target profit calculations
  - Simulations

The price is NOT re-fetched during the session.

------------------------------------------------------------

## 8. Portfolio Logic Isolation

Important rule:

Gold price resolution does NOT modify portfolio data.

- Investments remain unchanged
- Only valuation changes
- All calculations reuse existing portfolio logic

This ensures data integrity and safe upgrades.

------------------------------------------------------------

## 9. Design Philosophy

- Reliability over cleverness
- Explicit fallbacks over silent failure
- Simple synchronous logic for CLI safety
- Clear separation of concerns

------------------------------------------------------------

## 10. Current Status

- Portfolio logic: Stable
- Gold price resolution: Stable
- API integration: Safe
- Fallback system: Implemented
- Ready for future refactors and extensions
