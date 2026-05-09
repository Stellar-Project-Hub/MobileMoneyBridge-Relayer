import { Request, Response } from "express";
import { WebhookPayload } from "../types";

/** Parse an MTN MoMo payment notification into a normalised WebhookPayload. */
export function parseMtnPayload(raw: Record<string, unknown>): WebhookPayload {
  // TODO: implement full MTN MoMo callback parsing (see issue #2)
  return {
    provider: "mtn_momo",
    transactionId: raw["externalId"] as string ?? "",
    amount: Number(raw["amount"] ?? 0),
    currency: raw["currency"] as string ?? "XOF",
    senderPhone: raw["payer"]?.toString() ?? "",
    recipientPhone: raw["payee"]?.toString() ?? "",
    timestamp: new Date().toISOString(),
    rawBody: raw,
  };
}

export function mtnWebhookHandler(req: Request, res: Response): void {
  const payload = parseMtnPayload(req.body as Record<string, unknown>);
  res.json({ received: true, transactionId: payload.transactionId });
}
