import { Request, Response } from "express";
import { WebhookPayload } from "../types";

/** Parse an Airtel Money payment notification into a normalised WebhookPayload. */
export function parseAirtelPayload(raw: Record<string, unknown>): WebhookPayload {
  // TODO: implement full Airtel Money callback parsing (see issue #2)
  const txn = (raw["transaction"] as Record<string, unknown>) ?? {};
  return {
    provider: "airtel_money",
    transactionId: txn["id"] as string ?? "",
    amount: Number(txn["amount"] ?? 0),
    currency: txn["currency"] as string ?? "UGX",
    senderPhone: (txn["sender"] as Record<string, unknown>)?.["msisdn"]?.toString() ?? "",
    recipientPhone: (txn["receiver"] as Record<string, unknown>)?.["msisdn"]?.toString() ?? "",
    timestamp: new Date().toISOString(),
    rawBody: raw,
  };
}

export function airtelWebhookHandler(req: Request, res: Response): void {
  const payload = parseAirtelPayload(req.body as Record<string, unknown>);
  res.json({ received: true, transactionId: payload.transactionId });
}
