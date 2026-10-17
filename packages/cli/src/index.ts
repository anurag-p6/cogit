import "dotenv/config";
import { Command } from "commander";
import { KIND_EXPIRY_DAYS, type CommitKind } from "@cogit/core";
import {
  runBranch,
  runCommit,
  runInit,
  runInvite,
  runJoin,
  runLog,
  runPull,
  runUse,
} from "./commands.js";

const KINDS = Object.keys(KIND_EXPIRY_DAYS) as CommitKind[];

async function main(): Promise<void> {
  const program = new Command();
  program
    .name("cogit")
    .description("Encrypted, wallet-signed team context on Arkiv")
    .version("0.0.0");

  program
    .command("init")
    .argument("<name>")
    .description("create a repo (plus main branch) and write .cogit/config.json")
    .action(async (name: string) => runInit(name));

  program
    .command("invite")
    .argument("<address>")
    .description("add a member to the repo and print an invite string")
    .action(async (address: string) => runInvite(address));

  program
    .command("join")
    .argument("<invite>")
    .description("join a repo from a cogit1: invite string")
    .action(async (invite: string) => runJoin(invite));

  program
    .command("branch")
    .argument("<name>")
    .description("create a branch forked from the current branch head")
    .action(async (name: string) => runBranch(name));

  program
    .command("use")
    .argument("<branch>")
    .description("switch the current branch")
    .action(async (branch: string) => runUse(branch));

  program
    .command("commit")
    .description("commit an encrypted, wallet-signed context entry to the current branch")
    .requiredOption("-m, --message <summary>", "one-line summary")
    .option("--details-file <path>", "markdown details from a file")
    .option("--kind <kind>", `one of: ${KINDS.join(", ")}`, "note")
    .option("--tag <tags...>", "tags (space separated or repeated)", [])
    .action(async (opts: { message: string; detailsFile?: string; kind: string; tag: string[] }) =>
      runCommit({ message: opts.message, detailsFile: opts.detailsFile, kind: opts.kind, tags: opts.tag }),
    );

  program
    .command("pull")
    .argument("<branch>")
    .description("verified markdown for a branch (oldest first) → stdout + .cogit/context/<branch>.md")
    .option("--out <file>", "write here instead of .cogit/context/<branch>.md")
    .option("--kind <kind>", "only commits of this kind")
    .option("--tag <tag>", "only commits carrying this tag")
    .action(async (branch: string, opts: { out?: string; kind?: string; tag?: string }) =>
      runPull(branch, opts),
    );

  program
    .command("log")
    .description("list commits with verified/invalid status")
    .option("--branch <branch>", "only this branch")
    .action(async (opts: { branch?: string }) => runLog(opts));

  await program.parseAsync(process.argv);
}

main().catch((err: unknown) => {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
