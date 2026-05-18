import {
  Account,
  Contract,
  Keypair,
  SorobanRpc,
  StrKey,
} from "@stellar/stellar-sdk";
import { submitSettlement } from "../src/stellar/settlementClient";

describe("submitSettlement", () => {
  const keypair = Keypair.random();
  const payee = Keypair.random().publicKey();
  const tokenAddress = StrKey.encodeContract(Buffer.alloc(32, 1));
  const contractId = StrKey.encodeContract(Buffer.alloc(32, 2));

  beforeEach(() => {
    process.env.STELLAR_SECRET_KEY = keypair.secret();
    process.env.SETTLEMENT_CONTRACT_ID = contractId;
    process.env.STELLAR_RPC_URL = "https://rpc.example.test";
    process.env.STELLAR_NETWORK = "testnet";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("invokes settle and returns the confirmed transaction hash", async () => {
    const getAccount = jest
      .spyOn(SorobanRpc.Server.prototype, "getAccount")
      .mockResolvedValue(new Account(keypair.publicKey(), "1"));
    const simulateTransaction = jest
      .spyOn(SorobanRpc.Server.prototype, "simulateTransaction")
      .mockResolvedValue({ latestLedger: 1 } as never);
    const prepareTransaction = jest.spyOn(
      SorobanRpc.Server.prototype,
      "prepareTransaction",
    ).mockImplementation(async (tx) => tx as never);
    const sendTransaction = jest
      .spyOn(SorobanRpc.Server.prototype, "sendTransaction")
      .mockResolvedValue({ status: "PENDING", hash: "tx-hash" } as never);
    const getTransaction = jest
      .spyOn(SorobanRpc.Server.prototype, "getTransaction")
      .mockResolvedValue({
        status: SorobanRpc.Api.GetTransactionStatus.SUCCESS,
      } as never);
    const contractCall = jest.spyOn(Contract.prototype, "call");

    const result = await submitSettlement({
      settlementId: "settlement_1",
      payer: keypair.publicKey(),
      payee,
      tokenAddress,
      amount: 100n,
      providerRef: "mpesa_tx_1",
    });

    expect(result).toEqual({ success: true, txHash: "tx-hash" });
    expect(getAccount).toHaveBeenCalledWith(keypair.publicKey());
    expect(contractCall).toHaveBeenCalledWith(
      "settle",
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
    expect(simulateTransaction).toHaveBeenCalledTimes(1);
    expect(prepareTransaction).toHaveBeenCalledTimes(1);
    expect(sendTransaction).toHaveBeenCalledTimes(1);
    expect(getTransaction).toHaveBeenCalledWith("tx-hash");
  });

  it("returns simulation errors without submitting", async () => {
    jest
      .spyOn(SorobanRpc.Server.prototype, "getAccount")
      .mockResolvedValue(new Account(keypair.publicKey(), "1"));
    jest
      .spyOn(SorobanRpc.Server.prototype, "simulateTransaction")
      .mockResolvedValue({ error: "bad simulation", latestLedger: 1 } as never);
    const sendTransaction = jest.spyOn(
      SorobanRpc.Server.prototype,
      "sendTransaction",
    );

    const result = await submitSettlement({
      settlementId: "settlement_2",
      payer: keypair.publicKey(),
      payee,
      tokenAddress,
      amount: 100n,
      providerRef: "mpesa_tx_2",
    });

    expect(result).toEqual({
      success: false,
      error: "Simulation failed: bad simulation",
    });
    expect(sendTransaction).not.toHaveBeenCalled();
  });
});
