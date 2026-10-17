import "dotenv/config";
import { randomBytes } from "node:crypto";
import {
  ExpirationTime,
  MAX_PAYLOAD_BYTES,
  addr,
  createPublicClient,
  createWalletClient,
  i32,
  jsonToPayload,
  str,
  u64,
  type Attributes,
} from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { and, eq } from "@arkiv-network/sdk/query";
import { formatEther, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const rpcUrl = process.env.ARKIV_RPC_URL ?? tiramisu.rpcUrls.default.http[0];
const pk = process.env.PRIVATE_KEY as Hex | undefined;
const pk2 = process.env.PRIVATE_KEY_2 as Hex | undefined;

if (!pk) {
  console.error("Missing PRIVATE_KEY in .env — copy .env.example and fill a funded Tiramisu key.");
  process.exit(1);
}

const owner = privateKeyToAccount(pk);
const other = pk2 ? privateKeyToAccount(pk2) : undefined;

const pub = createPublicClient({ chain: tiramisu, transport: http(rpcUrl) });
const wallet = createWalletClient({ chain: tiramisu, transport: http(rpcUrl), account: owner });
const otherWallet = other
  ? createWalletClient({ chain: tiramisu, transport: http(rpcUrl), account: other })
  : undefined;

type Result = { name: string; pass: boolean; detail: string; gate: boolean };
const results: Result[] = [];

function record(name: string, pass: boolean, detail: string, gate = false): void {
  results.push({ name, pass, detail, gate });
  console.log(`[${pass ? "PASS" : "FAIL"}] ${name}\n       ${detail}`);
}

function failText(err: unknown): string {
  if (err instanceof Error) {
    const extra = [err.cause instanceof Error ? err.cause.message : undefined, (err as { details?: string }).details]
      .filter(Boolean)
      .join(" | ");
    return extra ? `${err.message} | ${extra}` : err.message;
  }
  return String(err);
}

function attrOf(attributes: Attributes | undefined, name: string): unknown {
  const value = attributes?.[name];
  if (value && typeof value === "object" && "value" in value) {
    return (value as { value: unknown }).value;
  }
  return undefined;
}

async function main(): Promise<void> {
  const repoId = randomBytes(8).toString("hex");
  let entityKey: Hex | undefined;

  const ownerBalance = await pub.getBalance({ address: owner.address });
  const otherBalance = other ? await pub.getBalance({ address: other.address }) : undefined;
  console.log(`owner  ${owner.address}  ${formatEther(ownerBalance)} GLM`);
  if (other && otherBalance !== undefined) {
    console.log(`other  ${other.address}  ${formatEther(otherBalance)} GLM`);
  }
  console.log(`rpc    ${rpcUrl}`);
  console.log(`repoId ${repoId}\n`);

  try {
    const block = await pub.getBlockNumber();
    record("connect (getBlockNumber)", block > 0n, `head block ${block}`, false);
  } catch (err) {
    record("connect (getBlockNumber)", false, failText(err), true);
  }

  try {
    const created = await wallet.createEntity({
      payload: jsonToPayload({ hello: "spike", repoId }),
      contentType: "application/json",
      attributes: {
        type: "spike",
        repo_id: repoId,
        owner: addr(owner.address),
        ts: u64(BigInt(Math.floor(Date.now() / 1000))),
      },
      expires: ExpirationTime.fromHours(6),
    });
    entityKey = created.entityKey;
    const receipt = await pub.waitForTransactionReceipt({ hash: created.txHash, timeout: 60_000 });
    record(
      "create entity w/ attrs+expiry",
      receipt.status === "success",
      `key ${created.entityKey} | block ${receipt.blockNumber} | expiresAt(est) ${created.expiresAt}`,
      true,
    );
  } catch (err) {
    record("create entity w/ attrs+expiry", false, failText(err), true);
  }

  if (entityKey) {
    const key = entityKey;
    try {
      const page = await pub
        .select({ key: true, owner: true, attributes: true })
        .where(and(eq("type", "spike"), eq("repo_id", repoId)))
        .fetch();
      const found = page.entities.some((e) => e.key === key);
      record(
        "query by attributes (select/where/eq)",
        found && page.entities.length >= 1,
        `${page.entities.length} match(es) at block ${page.blockNumber}; ours ${found ? "found" : "NOT found"}`,
        true,
      );
    } catch (err) {
      record("query by attributes (select/where/eq)", false, failText(err), true);
    }

    try {
      const before = await pub.getEntity(key);
      const patched = await wallet.patchEntity({
        entityKey: key,
        set: { status: str("patched"), level: i32(2) },
      });
      await pub.waitForTransactionReceipt({ hash: patched.txHash, timeout: 60_000 });
      const after = await pub.getEntity(key);
      const ok = attrOf(after.attributes, "status") === "patched" && attrOf(after.attributes, "level") === 2;
      record(
        "owner update (patchEntity)",
        ok,
        `status=${String(attrOf(after.attributes, "status"))} level=${String(attrOf(after.attributes, "level"))} | updatedAt ${before.updatedAt} -> ${after.updatedAt}`,
        true,
      );
    } catch (err) {
      record("owner update (patchEntity)", false, failText(err), true);
    }

    try {
      const entity = await pub.getEntity(key);
      const head = await pub.getBlockNumber();
      const ownerOk = entity.owner?.toLowerCase() === owner.address.toLowerCase();
      const createdOk = entity.createdAt !== undefined && entity.createdAt <= head;
      const expiryOk =
        entity.createdAt !== undefined && entity.expiresAt !== undefined && entity.expiresAt > entity.createdAt;
      record(
        "owner address + block numbers (getEntity)",
        ownerOk && createdOk && expiryOk,
        `owner ${entity.owner} | createdAt block ${entity.createdAt} | expiresAt block ${entity.expiresAt} | head ${head} | contentType ${entity.contentType}`,
        false,
      );
    } catch (err) {
      record("owner address + block numbers (getEntity)", false, failText(err), false);
    }

    if (!otherWallet) {
      record("non-owner update rejected", false, "PRIVATE_KEY_2 missing — fund a second wallet to test this", false);
    } else {
      try {
        const bad = await otherWallet.patchEntity({ entityKey: key, set: { hacked: true } });
        await pub.waitForTransactionReceipt({ hash: bad.txHash, timeout: 60_000 });
        record("non-owner update rejected", false, `patch by non-owner unexpectedly SUCCEEDED (tx ${bad.txHash})`, false);
      } catch (err) {
        const msg = failText(err);
        const after = await pub.getEntity(key).catch(() => undefined);
        const unchanged = !after || attrOf(after.attributes, "hacked") === undefined;
        const fundsIssue = msg.toLowerCase().includes("insufficient funds");
        record(
          "non-owner update rejected",
          unchanged && !fundsIssue,
          `error: ${msg}${fundsIssue ? " (WARNING: looks like an unfunded second wallet, not an ownership rejection)" : ""}`,
          false,
        );
      }
    }

    try {
      const probe = async (size: number): Promise<string | undefined> => {
        try {
          const created = await wallet.createEntity({
            payload: new Uint8Array(size),
            contentType: "application/octet-stream",
            attributes: { type: "spike", repo_id: repoId, tag: str("limit") },
            expires: ExpirationTime.fromHours(1),
          });
          await pub.waitForTransactionReceipt({ hash: created.txHash, timeout: 60_000 });
          return undefined;
        } catch (err) {
          return failText(err);
        }
      };

      let lo = 0;
      let hi: number | undefined;
      let hiErr: string | undefined;

      const firstErr = await probe(MAX_PAYLOAD_BYTES);
      if (firstErr === undefined) {
        lo = MAX_PAYLOAD_BYTES;
        const nextErr = await probe(MAX_PAYLOAD_BYTES + 1);
        if (nextErr !== undefined) {
          hi = MAX_PAYLOAD_BYTES + 1;
          hiErr = nextErr;
        } else {
          let size = (MAX_PAYLOAD_BYTES + 1) * 2;
          while (size <= 8 * 1024 * 1024) {
            const err = await probe(size);
            if (err !== undefined) {
              hi = size;
              hiErr = err;
              break;
            }
            lo = size;
            size *= 2;
          }
        }
      } else {
        hi = MAX_PAYLOAD_BYTES;
        hiErr = firstErr;
      }

      if (hi !== undefined) {
        while (hi - lo > 1) {
          const mid = Math.floor((lo + hi) / 2);
          const err = await probe(mid);
          if (err === undefined) {
            lo = mid;
          } else {
            hi = mid;
            hiErr = err;
          }
        }
      }

      const boundaryFound = lo > 0 && hi !== undefined && hi === lo + 1;
      record(
        "payload size limit (binary search)",
        boundaryFound,
        `largest accepted ${lo} bytes | rejected at ${lo + 1} with: ${hiErr ?? "no failure found"} | engine cap 131072 covers payload+attrs (SDK MAX_PAYLOAD_BYTES=${MAX_PAYLOAD_BYTES})`,
        false,
      );
    } catch (err) {
      record("payload size limit (binary search)", false, failText(err), false);
    }
  } else {
    record("query by attributes (select/where/eq)", false, "skipped — create failed", true);
    record("owner update (patchEntity)", false, "skipped — create failed", true);
    record("owner address + block numbers (getEntity)", false, "skipped — create failed", false);
    record("non-owner update rejected", false, "skipped — create failed", false);
    record("payload size limit (binary search)", false, "skipped — create failed", false);
  }

  console.log("\n=== M0 spike summary ===");
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}`);
  }
  const gateFailed = results.some((r) => r.gate && !r.pass);
  const anyFailed = results.some((r) => !r.pass);
  if (gateFailed) {
    console.error("\nGATE FAILURE: create/query/update failed — stop and report per SPEC.");
    process.exitCode = 1;
  } else if (anyFailed) {
    console.error("\nNon-gate checks failed — see above.");
    process.exitCode = 1;
  } else {
    console.log("\nALL PASS — M0 gate cleared.");
  }
}

main().catch((err) => {
  console.error("spike crashed:", failText(err));
  process.exit(1);
});
