# CryptoAgent - Paper Trading Simulator

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A rule-based trading agent that analyzes live crypto prices and generates buy/sell signals
- Live price fetching via HTTP outcalls to a public crypto API (CoinGecko)
- Simulated portfolio with virtual USD balance ($10,000 starting balance)
- Trade execution: buy/sell orders recorded on-chain
- Trade history log with timestamps, prices, and amounts
- Agent strategies: Simple Moving Average (SMA) crossover strategy
- Multi-coin support: BTC, ETH, SOL, BNB
- P&L tracking: realized and unrealized gains/losses
- Agent on/off toggle to start/stop automated trading
- Manual trade override (user can buy/sell manually)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Store portfolio state: cash balance, coin holdings
   - Store price history per coin (used for SMA calculation)
   - HTTP outcall to CoinGecko API to fetch current prices
   - Agent logic: compute SMA-7 and SMA-21; generate buy/sell signal on crossover
   - Execute simulated trades: update portfolio, record trade in history
   - Expose APIs: getPortfolio, getPrices, getTrades, runAgent, manualTrade, toggleAgent, resetPortfolio

2. Frontend:
   - Dashboard with portfolio value chart and total P&L
   - Live price ticker for supported coins
   - Agent control panel: enable/disable, strategy settings
   - Trade history table
   - Holdings breakdown with per-coin P&L
   - Manual trade panel
