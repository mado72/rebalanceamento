export type YahooQuote = {
    simbolo?: string,
    moeda?: string,
    tipo?: "CRYPTOCURRENCY" | "CURRENCY" | "ETF" | "EQUITY" | "FUTURE" | "INDEX" | "MUTUALFUND" | "OPTION",
    nome?: string,
    cotacao?: number,
    variacao?: number
}
