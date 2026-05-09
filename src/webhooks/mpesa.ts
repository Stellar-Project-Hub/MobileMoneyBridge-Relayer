import { Request, Response } from "express";
import { WebhookPayload } from "../types";

/** Parse an M-Pesa STK Push callback into a normalised WebhookPayload. */
export function parseMpesaPayload(raw: Record<string, unknown>): WebhookPayload {
  // TODO: implement full M-Pesa STK Push callback parsing (see issue #1)
  const body = raw as Record<string, unknown>;
  return {
    provider: "mpesa",
    transactionId: body["TransactionID"] as string ?? "",
    amount: Number(body["Amount"] ?? 0),
    currency: "KES",
    senderPhone: body["MSISDN"] as string ?? "",
    recipientPhone: body["BusinessShortCode"] as string ?? "",
    timestamp: body["TransactionDate"] as string ?? new Date().toISOString(),
    rawBody: raw,
  };
}

export function mpesaWebhookHandler(req: Request, res: Response): void {
  const payload = parseMpesaPayload(req.body as Record<string, unknown>);
  // Relay to settlement layer (stub — see issue #3)
  res.json({ received: true, transactionId: payload.transactionId });
}
