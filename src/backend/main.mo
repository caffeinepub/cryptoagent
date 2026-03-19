import Map "mo:core/Map";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Custom Types
  public type Coin = { #BTC; #ETH; #SOL; #BNB };

  public type Direction = { #buy; #sell };

  public type Trade = {
    timestamp : Int;
    coin : Coin;
    direction : Direction;
    price : Float;
    quantity : Float;
    profitLoss : Float;
  };

  public type Portfolio = {
    cashBalance : Float;
    holdings : Map.Map<Coin, Float>;
    tradeHistory : List.List<Trade>;
    automatedTradingEnabled : Bool;
  };

  public type PortfolioView = {
    cashBalance : Float;
    holdings : [(Coin, Float)];
    tradeHistory : [Trade];
    automatedTradingEnabled : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module Coin {
    public func compare(coin1 : Coin, coin2 : Coin) : Order.Order {
      switch (coin1, coin2) {
        case (#BTC, #BTC) { #equal };
        case (#BTC, _) { #less };
        case (#ETH, #BTC) { #greater };
        case (#ETH, #ETH) { #equal };
        case (#ETH, _) { #less };
        case (#SOL, #BNB) { #less };
        case (#SOL, #SOL) { #equal };
        case (#SOL, _) { #less };
        case (#BNB, #BNB) { #equal };
        case (#BNB, _) { #greater };
      };
    };

    public func toText(coin : Coin) : Text {
      switch (coin) {
        case (#BTC) { "bitcoin" };
        case (#ETH) { "ethereum" };
        case (#SOL) { "solana" };
        case (#BNB) { "binancecoin" };
      };
    };
  };

  module Direction {
    public func compare(dir1 : Direction, dir2 : Direction) : Order.Order {
      switch (dir1, dir2) {
        case (#buy, #buy) { #equal };
        case (#buy, _) { #less };
        case (#sell, #buy) { #greater };
        case (#sell, #sell) { #equal };
      };
    };
  };

  // Authorization Setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent State - Per-user portfolios
  let portfolios = Map.empty<Principal, Portfolio>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to get or create portfolio for a user
  func getOrCreatePortfolio(user : Principal) : Portfolio {
    switch (portfolios.get(user)) {
      case (?portfolio) { portfolio };
      case (null) {
        let newPortfolio : Portfolio = {
          cashBalance = 10000.0;
          holdings = Map.empty<Coin, Float>();
          tradeHistory = List.empty<Trade>();
          automatedTradingEnabled = false;
        };
        portfolios.add(user, newPortfolio);
        newPortfolio;
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Transform Function for HTTP Outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Get Live Crypto Price
  public shared ({ caller }) func getLivePrice(coin : Coin) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch prices");
    };
    let _url = "https://localhost:8080/price/" # Coin.toText(coin);
    //_let result = await OutCall.httpGetRequest(url, [], transform);
    //_let price = Float.fromText(result);
    //_switch (price) {
    //_  case (?v) { v };
    //_  case (null) { Runtime.trap("Failed to parse price") };
    //_};
    0.0;
  };

  // Toggle Automated Trading
  public shared ({ caller }) func toggleAutomatedTrading() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle automated trading");
    };
    let portfolio = getOrCreatePortfolio(caller);
    let updatedPortfolio = {
      cashBalance = portfolio.cashBalance;
      holdings = portfolio.holdings;
      tradeHistory = portfolio.tradeHistory;
      automatedTradingEnabled = not portfolio.automatedTradingEnabled;
    };
    portfolios.add(caller, updatedPortfolio);
  };

  // Execute Trade (Internal)
  func executeTradeInternal(user : Principal, coin : Coin, direction : Direction, price : Float, quantity : Float) {
    let portfolio = getOrCreatePortfolio(user);

    let newTrade : Trade = {
      timestamp = Time.now();
      coin;
      direction;
      price;
      quantity;
      profitLoss = 0.0;
    };

    // Update holdings
    let currentQuantity = switch (portfolio.holdings.get(coin)) {
      case (?q) { q };
      case (null) { 0.0 };
    };

    let newQuantity = currentQuantity + (if (direction == #buy) { quantity } else { -quantity });
    portfolio.holdings.add(coin, newQuantity);

    // Update cash balance
    let cashChange = (if (direction == #buy) { -1.0 } else { 1.0 }) * price * quantity;
    let newCashBalance = portfolio.cashBalance + cashChange;

    // Update trade history
    portfolio.tradeHistory.add(newTrade);

    // Keep only last 100 trades
    if (portfolio.tradeHistory.size() > 100) {
      let tradesArray = portfolio.tradeHistory.toArray();
      if (tradesArray.size() > 1) {
        let newTradesArray = tradesArray.sliceToArray(1, tradesArray.size());
        portfolio.tradeHistory.clear();
        for (trade in newTradesArray.values()) {
          portfolio.tradeHistory.add(trade);
        };
      };
    };

    let updatedPortfolio = {
      cashBalance = newCashBalance;
      holdings = portfolio.holdings;
      tradeHistory = portfolio.tradeHistory;
      automatedTradingEnabled = portfolio.automatedTradingEnabled;
    };

    portfolios.add(user, updatedPortfolio);
  };

  // Public Buy/Sell Trade
  public shared ({ caller }) func trade(coin : Coin, direction : Direction, quantity : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can execute trades");
    };
    let price = await getLivePrice(coin);
    executeTradeInternal(caller, coin, direction, price, quantity);
  };

  func toPortfolioView(portfolio : Portfolio) : PortfolioView {
    {
      cashBalance = portfolio.cashBalance;
      holdings = portfolio.holdings.toArray();
      tradeHistory = portfolio.tradeHistory.toArray();
      automatedTradingEnabled = portfolio.automatedTradingEnabled;
    };
  };

  // Get Portfolio Stats
  public query ({ caller }) func getPortfolioStats() : async PortfolioView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio stats");
    };
    toPortfolioView(getOrCreatePortfolio(caller));
  };

  // Reset Portfolio
  public shared ({ caller }) func resetPortfolio() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset their portfolio");
    };
    let newPortfolio : Portfolio = {
      cashBalance = 10000.0;
      holdings = Map.empty<Coin, Float>();
      tradeHistory = List.empty<Trade>();
      automatedTradingEnabled = false;
    };
    portfolios.add(caller, newPortfolio);
  };
};
