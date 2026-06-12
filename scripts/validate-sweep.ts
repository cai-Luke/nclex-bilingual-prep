import { printSweepReport, resolveSweepPath, validateSweep } from "./validate-sweep-lib";

const usage = () => {
  console.error("Usage: npm run validate-sweep -- <manifest.jsonl> <summary.json> [--bank <bank.json...>] [--strict]");
};

const args = process.argv.slice(2);
const positional: string[] = [];
const bankPaths: string[] = [];
let strict = false;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--strict") {
    strict = true;
  } else if (arg === "--bank") {
    index += 1;
    while (index < args.length && !args[index].startsWith("--")) {
      bankPaths.push(resolveSweepPath(args[index]));
      index += 1;
    }
    index -= 1;
  } else if (arg.startsWith("--")) {
    usage();
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  } else {
    positional.push(arg);
  }
}

if (positional.length !== 2) {
  usage();
  process.exit(1);
}

try {
  const report = await validateSweep({
    manifestPath: resolveSweepPath(positional[0]),
    summaryPath: resolveSweepPath(positional[1]),
    bankPaths,
    strict,
  });
  printSweepReport(report);
  process.exit(report.status === "rejected" ? 1 : 0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
