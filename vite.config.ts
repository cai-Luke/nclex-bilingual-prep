import { execFileSync } from "node:child_process";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { AppBuildInfo } from "./lib/app-build-info";

const readGitCommit = (): string | null => {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
  } catch {
    return null;
  }
};

const createBuildInfo = (): AppBuildInfo => {
  const builtAt = new Date().toISOString();
  const githubSha = process.env.GITHUB_SHA?.trim();
  const gitCommit = readGitCommit();
  const buildId = githubSha || (gitCommit ? `${gitCommit}-${builtAt}` : `local-${builtAt}`);
  return { buildId, builtAt };
};

const buildInfoPlugin = (buildInfo: AppBuildInfo): Plugin => ({
  name: "app-build-info",
  transformIndexHtml: {
    order: "pre",
    handler: () => [
      {
        tag: "meta",
        attrs: { name: "app-build-id", content: buildInfo.buildId },
        injectTo: "head",
      },
      {
        tag: "meta",
        attrs: { name: "app-built-at", content: buildInfo.builtAt },
        injectTo: "head",
      },
    ],
  },
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "build-info.json",
      source: `${JSON.stringify(buildInfo, null, 2)}\n`,
    });
  },
});

const buildInfo = createBuildInfo();

export default defineConfig({
  base: "./",
  plugins: [react(), buildInfoPlugin(buildInfo)],
});
