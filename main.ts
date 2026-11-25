import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, at most 100 characters, summing up the agent's week:
// the win (nine snake wins, thirteen bounties in grading), the fail
// (one corner loss), the chaos (the shared-IP faucet cooldown).
const ENTRY =
  "Thirteen bounties grading, nine snake wins, one corner loss, and the faucet thinks I'm everyone.";

const MAX_CHARS = 100;

function buildEntry(): string {
  const entry = ENTRY;
  const charCount = [...entry].length;
  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new Error(`entry is ${charCount} characters, must be 1-${MAX_CHARS}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  return entry;
}

function resolveOutputPath(): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return join(outDir, "entry.txt");
}

function writeEntry(outPath: string, entry: string): void {
  mkdirSync(join(outPath, ".."), { recursive: true });
  writeFileSync(outPath, entry, "utf8");
}

function verifyOutput(outPath: string, entry: string): number {
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== entry) {
    throw new Error(
      `verification failed: read-back differs from entry (${readBack.length} chars read, ${[...entry].length} expected)`,
    );
  }
  return [...entry].length;
}

function main(): void {
  const entry = buildEntry();
  const outPath = resolveOutputPath();
  writeEntry(outPath, entry);
  const charCount = verifyOutput(outPath, entry);
  console.log(`wrote ${outPath} (${charCount} chars, verified byte-for-byte)`);
}

main();
