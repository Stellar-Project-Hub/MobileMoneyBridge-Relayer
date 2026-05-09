import { WebhookPayload, SettlementRequest } from "../types";
import { submitSettlement } from "../stellar/settlementClient";
import crypto from "crypto";

const TOKEN_ADDRESS = process.env.SETTLEMENT_CONTRACT_ID ?? "";

/**
 * Convert a normalised WebhookPayload into a SettlementRequest and submit it.
 * Phone-to-Stellar address resolution is stubbed (see issue #4).
 */
export async function relayToStellar(payload: WebhookPayload) {
  const req: SettlementRequest = {
    settlementId: crypto.randomUUID(),
    payer: `G_STUB_${payload.senderPhone}`,
    payee: `G_STUB_${payload.recipientPhone}`,
    tokenAddress: TOKEN_ADDRESS,
    amount: BigInt(Math.round(payload.amount * 1_000_000)),
    providerRef: payload.transactionId,
  };
  return submitSettlement(req);
}
