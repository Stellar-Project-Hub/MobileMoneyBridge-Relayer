import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

/** Verify HMAC-SHA256 signature from a webhook provider. */
export function verifySignature(secret: string, headerKey: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const signature = req.headers[headerKey] as string | undefined;
    if (!signature) {
      res.status(401).json({ error: "Missing signature header" });
      return;
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
    next();
  };
}
