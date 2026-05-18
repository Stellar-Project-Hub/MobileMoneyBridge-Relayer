import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  SorobanRpc,
  TransactionBuilder,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { SettlementRequest, SettlementResult } from "../types";

const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";
const POLL_INTERVAL_MS = 1_000;
const MAX_POLL_ATTEMPTS = 10;

function getConfig() {
  return {
    rpcUrl: process.env.STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
    secretKey: process.env.STELLAR_SECRET_KEY ?? "",
    contractId: process.env.SETTLEMENT_CONTRACT_ID ?? "",
    network:
      process.env.STELLAR_NETWORK === "mainnet"
        ? Networks.PUBLIC
        : Networks.TESTNET,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSettlementArgs(req: SettlementRequest) {
  return [
    nativeToScVal(req.settlementId, { type: "symbol" }),
    Address.fromString(req.payer).toScVal(),
    Address.fromString(req.payee).toScVal(),
    Address.fromString(req.tokenAddress).toScVal(),
    nativeToScVal(req.amount, { type: "i128" }),
    nativeToScVal(req.providerRef, { type: "symbol" }),
  ];
}

/**
 * Submit a settlement transaction to the deployed Soroban settlement contract.
 */
export async function submitSettlement(
  req: SettlementRequest,
): Promise<SettlementResult> {
  const { rpcUrl, secretKey, contractId, network } = getConfig();

  if (!secretKey) {
    return { success: false, error: "STELLAR_SECRET_KEY not configured" };
  }
  if (!contractId) {
    return { success: false, error: "SETTLEMENT_CONTRACT_ID not configured" };
  }

  try {
    const keypair = Keypair.fromSecret(secretKey);
    const server = new SorobanRpc.Server(rpcUrl);
    const sourceAccount = await server.getAccount(keypair.publicKey());
    const contract = new Contract(contractId);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: network,
    })
      .addOperation(contract.call("settle", ...buildSettlementArgs(req)))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(transaction);
    if (SorobanRpc.Api.isSimulationError(simulation)) {
      return {
        success: false,
        error: `Simulation failed: ${simulation.error}`,
      };
    }

    const preparedTransaction = await server.prepareTransaction(transaction);
    preparedTransaction.sign(keypair);

    const sendResult = await server.sendTransaction(preparedTransaction);
    if (sendResult.status !== "PENDING") {
      return {
        success: false,
        error: `Transaction submission failed: ${sendResult.status}`,
      };
    }

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      const result = await server.getTransaction(sendResult.hash);
      if (result.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        return { success: true, txHash: sendResult.hash };
      }
      if (result.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
        return { success: false, error: "Settlement transaction failed" };
      }
      await sleep(POLL_INTERVAL_MS);
    }

    return {
      success: false,
      error: `Settlement transaction not confirmed: ${sendResult.hash}`,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
