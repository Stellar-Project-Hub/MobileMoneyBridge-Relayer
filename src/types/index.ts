// Shared types for mobile money webhook payloads and settlement requests

export type Provider = "mpesa" | "mtn_momo" | "airtel_money";

export interface WebhookPayload {
  provider: Provider;
  transactionId: string;
  amount: number;
  currency: string;
  senderPhone: string;
  recipientPhone: string;
  timestamp: string;
  rawBody: unknown;
}

export interface SettlementRequest {
  settlementId: string;
  payer: string;       // Stellar address
  payee: string;       // Stellar address
  tokenAddress: string;
  amount: bigint;
  providerRef: string;
}

export interface SettlementResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
