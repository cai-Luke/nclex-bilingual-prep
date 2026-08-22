import { readdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type BankProvenanceEntry = {
  id: string;
  bankPath: string;
  firstSeenOrdinal: number;
  firstSeenDate: string;
};

export type BankProvenanceManifest = {
  generatedAt: string;
  inputGitSha: string;
  entries: BankProvenanceEntry[];
  undated: string[];
};

type HistoricalParseFailure = {
  commit: string;
  bankPath: string;
  message: string;
};

type HistoricalEntry = BankProvenanceEntry;

const MAX_BUFFER = 128 * 1024 * 1024;

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  }).trim();
}

function isTopLevelBankPath(path: string): boolean {
  return /^banks\/[^/]+\.json$/i.test(path);
}

function parseTopLevelIds(text: string): string[] {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== "object" || parsed === null || !Array.isArray((parsed as { questions?: unknown }).questions)) {
    return [];
  }
  return (parsed as { questions: unknown[] }).questions.flatMap((question) => {
    if (typeof question !== "object" || question === null) return [];
    const id = (question as { id?: unknown }).id;
    return typeof id === "string" && id.length > 0 ? [id] : [];
  });
}

function listBankBlobs(commit: string, cwd: string): Map<string, string> {
  const output = execFileSync("git", ["ls-tree", "-r", "-z", commit, "--", "banks"], {
    cwd,
    encoding: "buffer",
    maxBuffer: MAX_BUFFER,
  }).toString("utf8");
  const blobs = new Map<string, string>();
  for (const entry of output.split("\0")) {
    if (!entry) continue;
    const [metadata, path] = entry.split("\t");
    if (!path || !isTopLevelBankPath(path)) continue;
    const [, type, objectSha] = metadata.split(" ");
    if (type === "blob" && objectSha) blobs.set(path, objectSha);
  }
  return blobs;
}

async function currentBundledIds(cwd: string): Promise<string[]> {
  const banksDirectory = await readdir(join(cwd, "banks"), { withFileTypes: true });
  const currentIds: string[] = [];
  for (const entry of banksDirectory
    .filter((candidate) => candidate.isFile() && /^.+\.json$/i.test(candidate.name))
    .sort((left, right) => left.name.localeCompare(right.name))) {
    const bankPath = join("banks", entry.name);
    const text = await readFile(join(cwd, bankPath), "utf8");
    let ids: string[];
    try {
      ids = parseTopLevelIds(text);
    } catch (error) {
      throw new Error(`Current bank ${bankPath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
    currentIds.push(...ids);
  }
  return currentIds;
}

export async function generateBankProvenance(cwd = process.cwd()): Promise<{
  manifest: BankProvenanceManifest;
  parseFailures: HistoricalParseFailure[];
}> {
  const root = resolve(cwd);
  const inputGitSha = git(["rev-parse", "HEAD"], root);
  const commits = git(["rev-list", "--first-parent", "--reverse", "HEAD"], root)
    .split("\n")
    .filter(Boolean);
  const firstSeenById = new Map<string, HistoricalEntry>();
  const lastBlobByPath = new Map<string, string>();
  const parseFailures: HistoricalParseFailure[] = [];

  for (const [firstSeenOrdinal, commit] of commits.entries()) {
    const firstSeenDate = git(["show", "-s", "--format=%cI", commit], root);
    const bankBlobs = listBankBlobs(commit, root);
    for (const [bankPath, blobSha] of bankBlobs) {
      if (lastBlobByPath.get(bankPath) === blobSha) continue;
      lastBlobByPath.set(bankPath, blobSha);

      let text: string;
      try {
        text = execFileSync("git", ["show", `${commit}:${bankPath}`], {
          cwd: root,
          encoding: "utf8",
          maxBuffer: MAX_BUFFER,
        });
      } catch (error) {
        parseFailures.push({
          commit,
          bankPath,
          message: `could not read historical path: ${error instanceof Error ? error.message : String(error)}`,
        });
        continue;
      }

      let ids: string[];
      try {
        ids = parseTopLevelIds(text);
      } catch (error) {
        parseFailures.push({
          commit,
          bankPath,
          message: error instanceof Error ? error.message : String(error),
        });
        continue;
      }
      for (const id of ids) {
        if (!firstSeenById.has(id)) {
          firstSeenById.set(id, { id, bankPath, firstSeenOrdinal, firstSeenDate });
        }
      }
    }
  }

  const currentIds = await currentBundledIds(root);
  const currentIdCounts = new Map<string, number>();
  for (const id of currentIds) currentIdCounts.set(id, (currentIdCounts.get(id) ?? 0) + 1);
  const duplicateCurrentIds = [...currentIdCounts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
  if (duplicateCurrentIds.length > 0) {
    throw new Error(`Current bundled top-level IDs are duplicated: ${duplicateCurrentIds.sort().join(", ")}`);
  }

  const currentIdSet = new Set(currentIds);
  const entries = [...firstSeenById.values()]
    .filter((entry) => currentIdSet.has(entry.id))
    .sort(
      (left, right) =>
        right.firstSeenOrdinal - left.firstSeenOrdinal ||
        left.bankPath.localeCompare(right.bankPath) ||
        left.id.localeCompare(right.id),
    );
  const datedIds = new Set(entries.map((entry) => entry.id));
  const undated = [...currentIdSet].filter((id) => !datedIds.has(id)).sort((left, right) => left.localeCompare(right));
  const outputIds = [...entries.map((entry) => entry.id), ...undated];
  if (outputIds.length !== currentIds.length || new Set(outputIds).size !== currentIds.length) {
    throw new Error("Generated provenance does not contain each current bundled top-level ID exactly once");
  }

  const manifest: BankProvenanceManifest = {
    generatedAt: new Date().toISOString(),
    inputGitSha,
    entries,
    undated,
  };
  await writeFile(join(root, "banks-provenance.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return { manifest, parseFailures };
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const result = await generateBankProvenance();
  console.log(
    `Wrote banks-provenance.json: ${result.manifest.entries.length} dated entries, ${result.manifest.undated.length} undated entries.`,
  );
  if (result.parseFailures.length > 0) {
    console.log(`Historical parse failures skipped: ${result.parseFailures.length}`);
    for (const failure of result.parseFailures) {
      console.log(`- ${failure.commit.slice(0, 12)} ${failure.bankPath}: ${failure.message}`);
    }
  }
}
