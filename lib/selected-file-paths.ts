import { resolve } from "node:path";

export type SelectedFilePath = {
  resolvedPath: string;
  displayPath: string;
};

/** Deduplicate by resolved identity while retaining the first caller spelling. */
export const dedupeSelectedFilePaths = (files: readonly string[]): SelectedFilePath[] => {
  const selected: SelectedFilePath[] = [];
  const seen = new Set<string>();
  for (const displayPath of files) {
    const resolvedPath = resolve(displayPath);
    if (seen.has(resolvedPath)) continue;
    seen.add(resolvedPath);
    selected.push({ resolvedPath, displayPath });
  }
  return selected;
};
