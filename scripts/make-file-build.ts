import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const indexPath = join(process.cwd(), "dist", "index.html");
const html = await readFile(indexPath, "utf8");

const fileOpenableHtml = html
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
  .replace(/\s+crossorigin(?=\s|>)/g, "")
  .replace(/<link rel="modulepreload"[^>]+>\s*/g, "");

await writeFile(indexPath, fileOpenableHtml);
