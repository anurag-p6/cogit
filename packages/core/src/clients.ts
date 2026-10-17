import {
  createPublicClient,
  createWalletClient,
  type PublicArkivClient,
  type WalletArkivClient,
} from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { http } from "viem";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";

function rpcUrl(): string {
  return process.env.ARKIV_RPC_URL ?? tiramisu.rpcUrls.default.http[0];
}

export function publicClient(): PublicArkivClient {
  return createPublicClient({ chain: tiramisu, transport: http(rpcUrl()) });
}

export interface WalletContext {
  account: PrivateKeyAccount;
  address: string;
  wallet: WalletArkivClient;
  pub: PublicArkivClient;
}

export function walletContext(): WalletContext {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    throw new Error("PRIVATE_KEY is not set — put it in .env or the shell environment (see .env.example)");
  }
  const account = privateKeyToAccount(pk as `0x${string}`);
  return {
    account,
    address: account.address,
    wallet: createWalletClient({ chain: tiramisu, transport: http(rpcUrl()), account }),
    pub: publicClient(),
  };
}
