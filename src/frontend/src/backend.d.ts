import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PortfolioView {
    tradeHistory: Array<Trade>;
    holdings: Array<[Coin, number]>;
    cashBalance: number;
    automatedTradingEnabled: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Trade {
    direction: Direction;
    coin: Coin;
    profitLoss: number;
    timestamp: bigint;
    quantity: number;
    price: number;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum Coin {
    BNB = "BNB",
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}
export enum Direction {
    buy = "buy",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLivePrice(coin: Coin): Promise<number>;
    getPortfolioStats(): Promise<PortfolioView>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    resetPortfolio(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleAutomatedTrading(): Promise<void>;
    trade(coin: Coin, direction: Direction, quantity: number): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
