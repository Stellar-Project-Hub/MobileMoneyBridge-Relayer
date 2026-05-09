import { parseMpesaPayload } from "../src/webhooks/mpesa";
import { parseMtnPayload } from "../src/webhooks/mtn";
import { parseAirtelPayload } from "../src/webhooks/airtel";

describe("parseMpesaPayload", () => {
  it("normalises a basic M-Pesa callback", () => {
    const raw = { TransactionID: "TX123", Amount: "500", MSISDN: "254700000000", BusinessShortCode: "174379", TransactionDate: "20240101120000" };
    const result = parseMpesaPayload(raw);
    expect(result.provider).toBe("mpesa");
    expect(result.transactionId).toBe("TX123");
    expect(result.amount).toBe(500);
  });
});

describe("parseMtnPayload", () => {
  it("normalises a basic MTN MoMo callback", () => {
    const raw = { externalId: "MTN-001", amount: "200", currency: "GHS", payer: "233501234567", payee: "233509876543" };
    const result = parseMtnPayload(raw);
    expect(result.provider).toBe("mtn_momo");
    expect(result.transactionId).toBe("MTN-001");
    expect(result.amount).toBe(200);
  });
});

describe("parseAirtelPayload", () => {
  it("normalises a basic Airtel Money callback", () => {
    const raw = { transaction: { id: "AIR-001", amount: "100", currency: "UGX", sender: { msisdn: "256700000000" }, receiver: { msisdn: "256701111111" } } };
    const result = parseAirtelPayload(raw);
    expect(result.provider).toBe("airtel_money");
    expect(result.transactionId).toBe("AIR-001");
    expect(result.amount).toBe(100);
  });
});
